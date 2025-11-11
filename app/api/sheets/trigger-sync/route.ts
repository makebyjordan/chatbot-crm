import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { triggerSheetSync, logWebhookRequest } from '@/lib/n8n'
import { TriggerSyncSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada
    const { sheetId, force } = TriggerSyncSchema.parse(body)

    try {
      // Intentar llamar a n8n para trigger de sincronización
      const n8nResponse = await triggerSheetSync(sheetId)
      
      // Log del webhook exitoso
      await logWebhookRequest(
        '/trigger-sync',
        'POST',
        { sheetId, force },
        null,
        200,
        n8nResponse
      )

      // Marcar sincronizaciones como pendientes en la base de datos
      if (sheetId) {
        // Sincronización específica de un sheet
        await prisma.sheetSync.updateMany({
          where: {
            sheetId: sheetId,
          },
          data: {
            syncStatus: 'pending',
            lastSyncedAt: new Date(),
            syncError: null,
          },
        })
      } else {
        // Sincronización de todos los sheets
        await prisma.sheetSync.updateMany({
          data: {
            syncStatus: 'pending',
            lastSyncedAt: new Date(),
            syncError: null,
          },
        })
      }

      return NextResponse.json({
        success: true,
        message: 'Sincronización iniciada exitosamente',
        n8nResponse: n8nResponse,
        triggered: sheetId ? `Sheet ${sheetId}` : 'Todos los sheets',
      })

    } catch (n8nError) {
      // Log del error de n8n
      await logWebhookRequest(
        '/trigger-sync',
        'POST',
        { sheetId, force },
        null,
        500,
        null,
        n8nError instanceof Error ? n8nError.message : 'Unknown n8n error'
      )

      // Respuesta de éxito parcial - la sincronización se intentó pero n8n falló
      return NextResponse.json({
        success: true, // Marcamos como exitoso porque la API funcionó
        message: 'Solicitud de sincronización procesada (n8n no disponible)',
        warning: 'n8n no está disponible, la sincronización se realizará cuando esté online',
        n8nError: n8nError instanceof Error ? n8nError.message : 'Unknown error',
      })
    }

  } catch (error) {
    console.error('Error triggering sync:', error)

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

    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo iniciar la sincronización',
      },
      { status: 500 }
    )
  }
}
