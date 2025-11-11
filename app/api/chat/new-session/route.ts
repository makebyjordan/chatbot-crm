import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NewChatSessionSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada
    const { metadata } = NewChatSessionSchema.parse(body)

    // Crear nueva sesión de chat
    const chatSession = await prisma.chatSession.create({
      data: {
        metadata: metadata || {
          userAgent: request.headers.get('user-agent') || undefined,
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
          timestamp: new Date().toISOString(),
        },
        isActive: true,
        lastMessageAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      sessionToken: chatSession.sessionToken,
      sessionId: chatSession.id,
      message: 'Sesión de chat creada exitosamente',
    })

  } catch (error) {
    console.error('Error creating chat session:', error)

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
        message: 'No se pudo crear la sesión de chat',
      },
      { status: 500 }
    )
  }
}
