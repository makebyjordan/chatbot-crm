import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logWebhookRequest, verifyWebhookSignature, createWebhookSuccessResponse, createWebhookErrorResponse } from '@/lib/n8n'
import { WebhookChatResponseSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let payload: any = null

  try {
    // Obtener payload y headers
    const body = await request.text()
    payload = JSON.parse(body)
    const headers = Object.fromEntries(request.headers.entries())

    // Verificar signature del webhook si está configurado
    const signature = request.headers.get('x-webhook-signature')
    if (!verifyWebhookSignature(body, signature)) {
      await logWebhookRequest(
        '/api/webhook/chat-response',
        'POST',
        payload,
        headers,
        401,
        null,
        'Invalid webhook signature'
      )

      return NextResponse.json(
        createWebhookErrorResponse('Signature inválida', 'INVALID_SIGNATURE'),
        { status: 401 }
      )
    }

    // Validar estructura del payload
    const { sessionId, userMessage, aiResponse, intent, customerData } = WebhookChatResponseSchema.parse(payload)

    // Buscar la sesión de chat
    const chatSession = await prisma.chatSession.findFirst({
      where: {
        sessionToken: sessionId,
        isActive: true,
      },
    })

    if (!chatSession) {
      const errorResponse = createWebhookErrorResponse('Sesión no encontrada', 'SESSION_NOT_FOUND')
      
      await logWebhookRequest(
        '/api/webhook/chat-response',
        'POST',
        payload,
        headers,
        404,
        errorResponse
      )

      return NextResponse.json(errorResponse, { status: 404 })
    }

    let customerId = chatSession.customerId

    // Si viene información de cliente y no hay cliente asociado, crearlo o actualizarlo
    if (customerData && (customerData.email || customerData.name)) {
      try {
        if (customerData.email) {
          // Buscar cliente existente por email
          let existingCustomer = await prisma.customer.findUnique({
            where: { email: customerData.email },
          })

          if (existingCustomer) {
            // Actualizar cliente existente si viene nueva información
            if (customerData.name || customerData.phone || customerData.company) {
              existingCustomer = await prisma.customer.update({
                where: { id: existingCustomer.id },
                data: {
                  name: customerData.name || existingCustomer.name,
                  phone: customerData.phone || existingCustomer.phone,
                  company: customerData.company || existingCustomer.company,
                  // Actualizar status si era lead
                  status: existingCustomer.status === 'LEAD' ? 'CONTACT' : existingCustomer.status,
                  updatedAt: new Date(),
                },
              })
            }
            customerId = existingCustomer.id
          } else if (customerData.name && customerData.email) {
            // Crear nuevo cliente
            const newCustomer = await prisma.customer.create({
              data: {
                name: customerData.name,
                email: customerData.email,
                phone: customerData.phone || null,
                company: customerData.company || null,
                status: 'CONTACT',
                source: 'chat',
                notes: `Registrado automáticamente desde chat con intención: ${intent || 'general'}`,
              },
            })
            customerId = newCustomer.id
          }
        }

        // Asociar cliente a la sesión si no estaba asociado
        if (customerId && !chatSession.customerId) {
          await prisma.chatSession.update({
            where: { id: chatSession.id },
            data: { customerId },
          })
        }
      } catch (customerError) {
        console.warn('Error processing customer data:', customerError)
        // Continuar sin fallar el webhook
      }
    }

    // Crear o actualizar conversación
    const conversation = await prisma.conversation.create({
      data: {
        userMessage,
        aiResponse,
        intent: intent || 'general',
        platform: 'webchat',
        customerId,
      },
    })

    // Actualizar última actividad de la sesión
    await prisma.chatSession.update({
      where: { id: chatSession.id },
      data: {
        lastMessageAt: new Date(),
      },
    })

    const successResponse = createWebhookSuccessResponse({
      conversationId: conversation.id,
      customerId,
      sessionUpdated: true,
    })

    // Log webhook exitoso
    await logWebhookRequest(
      '/api/webhook/chat-response',
      'POST',
      payload,
      headers,
      200,
      successResponse
    )

    return NextResponse.json(successResponse)

  } catch (error) {
    console.error('Error processing chat response webhook:', error)

    let errorResponse
    let statusCode = 500

    // Error de validación de Zod
    if (error instanceof Error && error.name === 'ZodError') {
      statusCode = 400
      errorResponse = createWebhookErrorResponse(
        'Datos del webhook inválidos',
        'VALIDATION_ERROR'
      )
    } else {
      errorResponse = createWebhookErrorResponse(
        'Error interno del servidor',
        'INTERNAL_ERROR'
      )
    }

    // Log del error
    await logWebhookRequest(
      '/api/webhook/chat-response',
      'POST',
      payload || {},
      {},
      statusCode,
      errorResponse,
      error instanceof Error ? error.message : 'Unknown error'
    )

    return NextResponse.json(errorResponse, { status: statusCode })
  }
}
