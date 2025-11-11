import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Obtener estadísticas de sincronización
    const [totalRecords, syncedRecords, errorRecords, lastSync] = await Promise.all([
      // Total de registros
      prisma.sheetSync.count(),
      
      // Registros sincronizados exitosamente
      prisma.sheetSync.count({
        where: {
          syncStatus: 'synced',
        },
      }),
      
      // Registros con errores
      prisma.sheetSync.count({
        where: {
          syncStatus: 'error',
        },
      }),
      
      // Última sincronización
      prisma.sheetSync.findFirst({
        orderBy: {
          lastSyncedAt: 'desc',
        },
        select: {
          lastSyncedAt: true,
        },
      }),
    ])

    const status = {
      lastSync: lastSync?.lastSyncedAt?.toISOString() || new Date().toISOString(),
      totalRecords,
      syncedRecords,
      errorRecords,
      isRunning: false, // TODO: Implementar check de procesos en curso
    }

    return NextResponse.json({
      success: true,
      status,
      message: 'Estado de sincronización obtenido exitosamente',
    })

  } catch (error) {
    console.error('Error fetching sync status:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo obtener el estado de sincronización',
      },
      { status: 500 }
    )
  }
}
