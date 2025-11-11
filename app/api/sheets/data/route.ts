import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)

    // Obtener datos de sincronización con información del cliente
    const sheetData = await prisma.sheetSync.findMany({
      orderBy: {
        lastSyncedAt: 'desc',
      },
      take: limit,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            company: true,
            status: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: sheetData,
      count: sheetData.length,
      message: 'Datos de Google Sheets obtenidos exitosamente',
    })

  } catch (error) {
    console.error('Error fetching sheets data:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener los datos de Google Sheets',
      },
      { status: 500 }
    )
  }
}
