import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50) // máximo 50

    // Obtener actividad reciente combinada
    const [recentConversations, recentCustomers] = await Promise.all([
      // Últimas conversaciones
      prisma.conversation.findMany({
        take: Math.ceil(limit / 2),
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          customer: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
      
      // Últimos clientes registrados
      prisma.customer.findMany({
        take: Math.ceil(limit / 2),
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          source: true,
          createdAt: true,
        },
      }),
    ])

    // Formatear actividades para mostrar en el dashboard
    const activities = []

    // Agregar conversaciones
    for (const conversation of recentConversations) {
      activities.push({
        id: `conv-${conversation.id}`,
        type: 'conversation',
        title: 'Nueva conversación',
        description: conversation.customer 
          ? `Conversación con ${conversation.customer.name} (${conversation.customer.email})`
          : `Conversación con usuario anónimo`,
        timestamp: conversation.createdAt.toISOString(),
        metadata: {
          intent: conversation.intent,
          platform: conversation.platform,
          userMessage: conversation.userMessage.slice(0, 100) + (conversation.userMessage.length > 100 ? '...' : ''),
        },
      })
    }

    // Agregar clientes registrados
    for (const customer of recentCustomers) {
      activities.push({
        id: `customer-${customer.id}`,
        type: 'customer',
        title: 'Nuevo cliente registrado',
        description: `${customer.name} se registró como ${customer.status.toLowerCase()} desde ${customer.source}`,
        timestamp: customer.createdAt.toISOString(),
        metadata: {
          status: customer.status,
          source: customer.source,
          email: customer.email,
        },
      })
    }

    // Ordenar por fecha más reciente y limitar resultados
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    const limitedActivities = activities.slice(0, limit)

    return NextResponse.json({
      success: true,
      activities: limitedActivities,
      count: limitedActivities.length,
      message: 'Actividad reciente obtenida exitosamente',
    })

  } catch (error) {
    console.error('Error fetching recent activity:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo obtener la actividad reciente',
      },
      { status: 500 }
    )
  }
}
