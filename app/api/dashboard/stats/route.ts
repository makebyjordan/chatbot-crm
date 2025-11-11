import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DashboardStatsSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    
    // Validar parámetros de entrada
    const { days } = DashboardStatsSchema.parse(queryParams)

    // Calcular fechas
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)

    // Obtener estadísticas en paralelo para mejor rendimiento
    const [
      totalCustomers,
      newCustomersToday,
      activeConversations,
      totalLeads,
      totalCustomersConverted,
      newCustomersInPeriod
    ] = await Promise.all([
      // Total de clientes
      prisma.customer.count(),
      
      // Nuevos clientes hoy
      prisma.customer.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      
      // Conversaciones activas (sesiones de chat activas)
      prisma.chatSession.count({
        where: {
          isActive: true,
          lastMessageAt: {
            gte: new Date(Date.now() - 30 * 60 * 1000), // últimos 30 minutos
          },
        },
      }),
      
      // Total de leads para calcular tasa de conversión
      prisma.customer.count({
        where: {
          status: 'LEAD',
        },
      }),
      
      // Total de clientes convertidos
      prisma.customer.count({
        where: {
          status: 'CUSTOMER',
        },
      }),
      
      // Nuevos clientes en el período especificado
      prisma.customer.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          createdAt: true,
        },
      }),
    ])

    // Calcular tasa de conversión
    const totalProspects = totalLeads + totalCustomersConverted
    const conversionRate = totalProspects > 0 
      ? Math.round((totalCustomersConverted / totalProspects) * 100) 
      : 0

    // Preparar datos para respuesta
    const stats = {
      totalCustomers,
      newCustomersToday,
      activeConversations,
      conversionRate,
      // Estadísticas adicionales para gráficos
      newCustomersInPeriod: newCustomersInPeriod.length,
      periodDays: days,
    }

    return NextResponse.json({
      success: true,
      stats,
      message: 'Estadísticas obtenidas exitosamente',
    })

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)

    // Error de validación
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Parámetros inválidos',
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
        message: 'No se pudieron obtener las estadísticas',
      },
      { status: 500 }
    )
  }
}
