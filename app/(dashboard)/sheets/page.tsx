'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileSpreadsheet, RefreshCw, CheckCircle, AlertCircle, Clock, ExternalLink } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

interface SheetData {
  id: string
  customerId: string
  customer: {
    name: string
    email: string
    status: string
  }
  sheetId: string
  rowNumber?: number
  lastSyncedAt: string
  syncStatus: string
  syncError?: string
  data: any
  createdAt: string
}

interface SyncStatus {
  lastSync: string
  totalRecords: number
  syncedRecords: number
  errorRecords: number
  isRunning: boolean
}

export default function SheetsPage() {
  const [sheetData, setSheetData] = useState<SheetData[]>([])
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos de sheets
  const fetchSheetsData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [statusResponse, dataResponse] = await Promise.all([
        fetch('/api/sheets/sync-status'),
        fetch('/api/sheets/data')
      ])

      if (!statusResponse.ok || !dataResponse.ok) {
        throw new Error('Error al cargar datos de Google Sheets')
      }

      const statusData = await statusResponse.json()
      const sheetsData = await dataResponse.json()

      if (statusData.success) {
        setSyncStatus(statusData.status)
      }

      if (sheetsData.success) {
        setSheetData(sheetsData.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  // Trigger sincronización manual
  const triggerSync = async () => {
    try {
      setIsSyncing(true)
      setError(null)

      const response = await fetch('/api/sheets/trigger-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force: true }),
      })

      if (!response.ok) {
        throw new Error('Error al iniciar sincronización')
      }

      const data = await response.json()

      if (data.success) {
        // Esperar un poco y refrescar datos
        setTimeout(() => {
          fetchSheetsData()
        }, 2000)
      } else {
        throw new Error(data.error || 'Error desconocido')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al sincronizar')
    } finally {
      setIsSyncing(false)
    }
  }

  // Función para obtener el icono de status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  // Función para obtener el color del badge de status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchSheetsData()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Google Sheets</h1>
          <p className="text-muted-foreground">
            Sincronización en tiempo real con Google Sheets
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={fetchSheetsData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button 
            onClick={triggerSync}
            disabled={isSyncing || isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setError(null)} variant="outline" size="sm">
              Cerrar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileSpreadsheet className="h-5 w-5" />
            <span>Estado de Sincronización</span>
          </CardTitle>
          <CardDescription>
            Información sobre la última sincronización con Google Sheets
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-1/3"></div>
              <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
              <div className="h-3 bg-muted rounded animate-pulse w-1/4"></div>
            </div>
          ) : syncStatus ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Última Sincronización</p>
                <p className="text-lg font-semibold">
                  {formatRelativeTime(syncStatus.lastSync)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Registros</p>
                <p className="text-lg font-semibold">{syncStatus.totalRecords}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sincronizados</p>
                <p className="text-lg font-semibold text-green-600">{syncStatus.syncedRecords}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Con Errores</p>
                <p className="text-lg font-semibold text-red-600">{syncStatus.errorRecords}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No hay información de sincronización disponible</p>
          )}

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Enlace a Google Sheets:</span>
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href="https://docs.google.com/spreadsheets" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>Abrir Google Sheets</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Datos Sincronizados</CardTitle>
          <CardDescription>
            Clientes sincronizados desde Google Sheets
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-1/3"></div>
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
                  </div>
                  <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : sheetData.length === 0 ? (
            <div className="text-center py-8">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No hay datos sincronizados</p>
              <p className="text-sm text-muted-foreground">
                Los datos aparecerán aquí después de la primera sincronización
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {sheetData.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {getStatusIcon(item.syncStatus)}
                  </div>

                  {/* Customer Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-foreground truncate">
                        {item.customer.name}
                      </h3>
                      <Badge className={getStatusColor(item.syncStatus)}>
                        {item.syncStatus}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <span>{item.customer.email}</span>
                      {item.rowNumber && (
                        <span>Fila {item.rowNumber}</span>
                      )}
                      <span>Sheet ID: {item.sheetId.slice(0, 8)}...</span>
                    </div>
                  </div>

                  {/* Sync Info */}
                  <div className="text-right text-sm text-muted-foreground">
                    <p>Última sync:</p>
                    <p>{formatRelativeTime(item.lastSyncedAt)}</p>
                  </div>

                  {/* Error Info */}
                  {item.syncError && (
                    <div className="max-w-xs">
                      <p className="text-xs text-red-600 truncate" title={item.syncError}>
                        Error: {item.syncError}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Google Sheets</CardTitle>
          <CardDescription>
            Cómo configurar la sincronización automática
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Pasos para configurar:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Crear una hoja de Google Sheets con los clientes</li>
                <li>Configurar n8n con el workflow de sincronización</li>
                <li>Añadir las credenciales de Google Sheets en n8n</li>
                <li>Configurar el webhook hacia esta aplicación</li>
                <li>Probar la sincronización manual</li>
              </ol>
            </div>

            <div>
              <h4 className="font-medium mb-2">Formato esperado:</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Columna A:</strong> Nombre</p>
                <p><strong>Columna B:</strong> Email</p>
                <p><strong>Columna C:</strong> Teléfono</p>
                <p><strong>Columna D:</strong> Empresa</p>
                <p><strong>Columna E:</strong> Estado</p>
                <p><strong>Columna F:</strong> Notas</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
