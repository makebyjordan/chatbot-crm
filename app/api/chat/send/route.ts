import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendChatMessageToN8n, logWebhookRequest, handleWebhookError } from '@/lib/n8n'
import { ChatMessageSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada
    const { message, sessionId } = ChatMessageSchema.parse(body)

    // Verificar que la sesión existe y está activa
    const chatSession = await prisma.chatSession.findFirst({
      where: {
        sessionToken: sessionId,
        isActive: true,
      },
    })

    if (!chatSession) {
      return NextResponse.json(
        {
          success: false,
          error: 'Sesión no encontrada',
          message: 'La sesión de chat no existe o ha expirado',
        },
        { status: 404 }
      )
    }

    // Actualizar última actividad de la sesión
    await prisma.chatSession.update({
      where: {
        id: chatSession.id,
      },
      data: {
        lastMessageAt: new Date(),
      },
    })

    // Respuesta de IA mock mientras llamamos a n8n
    let aiResponse = 'Procesando tu mensaje...'

    try {
      // Intentar enviar a n8n para procesamiento con IA real
      const n8nResponse = await sendChatMessageToN8n(sessionId, message)
      
      // Log del webhook exitoso
      await logWebhookRequest(
        '/chat-message',
        'POST',
        { sessionId, message },
        null,
        200,
        n8nResponse
      )

      // Si n8n responde inmediatamente, usar esa respuesta
      if (n8nResponse && n8nResponse.response) {
        aiResponse = n8nResponse.response
      }
      
    } catch (n8nError) {
      // Log del error de n8n
      await handleWebhookError(
        '/chat-message',
        'POST',
        { sessionId, message },
        n8nError instanceof Error ? n8nError : new Error('Unknown n8n error')
      )

      // Continuar con respuesta mock si n8n falla
      console.warn('n8n call failed, using mock response:', n8nError)
      
      // Generar respuesta mock inteligente basada en el mensaje
      if (message.toLowerCase().includes('hola') || message.toLowerCase().includes('buenos')) {
        aiResponse = '¡Hola! Bienvenido a nuestro chatbot de IA. ¿En qué puedo ayudarte hoy?'
      } else if (message.toLowerCase().includes('precio') || message.toLowerCase().includes('costo')) {
        aiResponse = 'Te puedo ayudar con información sobre nuestros precios. ¿Qué tipo de servicio te interesa?'
      } else if (message.toLowerCase().includes('contacto') || message.toLowerCase().includes('hablar')) {
        aiResponse = 'Me gustaría conectarte con un especialista. ¿Podrías proporcionarme tu email?'
      } else {
        aiResponse = 'Entiendo tu consulta. Déjame procesarla y te responderé en un momento. ¿Hay algo específico en lo que pueda ayudarte?'
      }
    }

    // Guardar la conversación en la base de datos
    const conversation = await prisma.conversation.create({
      data: {
        userMessage: message,
        aiResponse: aiResponse,
        intent: extractIntent(message), // Helper function
        platform: 'webchat',
        customerId: chatSession.customerId,
      },
    })

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      response: aiResponse,
      message: 'Mensaje enviado exitosamente',
    })

  } catch (error) {
    console.error('Error sending chat message:', error)

    // Error de validación
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos inválidos',
          details: error.message,
        },
        { status: 400 }
      )
    }

    // Error de base de datos
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo enviar el mensaje',
      },
      { status: 500 }
    )
  }
}

// Helper function para extraer intención del mensaje
function extractIntent(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('buenas')) {
    return 'greeting'
  }
  
  if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cuánto')) {
    return 'pricing'
  }
  
  if (lowerMessage.includes('contacto') || lowerMessage.includes('hablar') || lowerMessage.includes('llamar')) {
    return 'contact_request'
  }
  
  if (lowerMessage.includes('registro') || lowerMessage.includes('registrar') || lowerMessage.includes('cuenta')) {
    return 'registration'
  }
  
  if (lowerMessage.includes('ayuda') || lowerMessage.includes('soporte') || lowerMessage.includes('problema')) {
    return 'support'
  }
  
  if (lowerMessage.includes('producto') || lowerMessage.includes('servicio') || lowerMessage.includes('qué hacen')) {
    return 'product_info'
  }
  
  return 'general_inquiry'
}
