import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100) // máximo 100 mensajes
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID de sesión requerido',
          message: 'Debes proporcionar un sessionId válido',
        },
        { status: 400 }
      )
    }

    // Buscar la sesión de chat
    const chatSession = await prisma.chatSession.findFirst({
      where: {
        sessionToken: sessionId,
      },
      include: {
        // Si hay un cliente asociado, incluir sus datos
        _count: {
          select: {
            // Podemos usar esto para obtener estadísticas si es necesario
          },
        },
      },
    })

    if (!chatSession) {
      return NextResponse.json(
        {
          success: false,
          error: 'Sesión no encontrada',
          message: 'La sesión de chat no existe',
        },
        { status: 404 }
      )
    }

    // Obtener conversaciones de esta sesión
    // Como no tenemos relación directa entre Conversation y ChatSession,
    // buscaremos por customerId si existe, o por fechas cercanas
    
    let conversations = []
    
    if (chatSession.customerId) {
      // Si hay un cliente asociado, obtener sus conversaciones
      conversations = await prisma.conversation.findMany({
        where: {
          customerId: chatSession.customerId,
        },
        orderBy: {
          createdAt: 'asc', // Ordenar cronológicamente
        },
        skip: offset,
        take: limit,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              status: true,
            },
          },
        },
      })
    } else {
      // Si no hay cliente asociado, buscar conversaciones recientes sin cliente
      // en un rango de tiempo cercano a la creación de la sesión
      const sessionStart = new Date(chatSession.createdAt.getTime() - 5 * 60 * 1000) // 5 min antes
      const sessionEnd = new Date(chatSession.lastMessageAt.getTime() + 5 * 60 * 1000) // 5 min después
      
      conversations = await prisma.conversation.findMany({
        where: {
          customerId: null, // Conversaciones sin cliente asociado
          createdAt: {
            gte: sessionStart,
            lte: sessionEnd,
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
        skip: offset,
        take: limit,
      })
    }

    // Actualizar última actividad de la sesión (marca como vista)
    await prisma.chatSession.update({
      where: {
        id: chatSession.id,
      },
      data: {
        lastMessageAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      conversations,
      sessionInfo: {
        id: chatSession.id,
        sessionToken: chatSession.sessionToken,
        isActive: chatSession.isActive,
        customerId: chatSession.customerId,
        createdAt: chatSession.createdAt,
        lastMessageAt: chatSession.lastMessageAt,
      },
      pagination: {
        limit,
        offset,
        count: conversations.length,
        hasMore: conversations.length === limit, // Si devolvió el límite exacto, probablemente hay más
      },
      message: 'Historial de chat obtenido exitosamente',
    })

  } catch (error) {
    console.error('Error fetching chat history:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo obtener el historial de chat',
      },
      { status: 500 }
    )
  }
}
