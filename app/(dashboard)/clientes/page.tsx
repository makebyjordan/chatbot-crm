'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Filter, Edit, Trash2, Users, Mail, Phone, Building } from 'lucide-react'
import { getStatusText, getStatusColor, getSourceText, getSourceColor, formatRelativeTime } from '@/lib/utils'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: string
  source: string
  notes?: string
  createdAt: string
  updatedAt: string
  _count: {
    conversations: number
    sheetSyncs: number
  }
}

interface CustomerFilters {
  search: string
  status: string
  source: string
}

export default function ClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<CustomerFilters>({
    search: '',
    status: '',
    source: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasMore: false
  })
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Cargar clientes
  const fetchCustomers = async (page = 1) => {
    try {
      setIsLoading(true)
      setError(null)

      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.source && { source: filters.source }),
      })

      const response = await fetch(`/api/customers?${searchParams}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar clientes')
      }

      const data = await response.json()

      if (data.success) {
        setCustomers(data.customers)
        setPagination(data.pagination)
      } else {
        throw new Error(data.error || 'Error desconocido')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  // Efecto para cargar datos iniciales y cuando cambian los filtros
  useEffect(() => {
    fetchCustomers(1)
  }, [filters])

  // Manejar cambios en filtros
  const handleFilterChange = (key: keyof CustomerFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({ search: '', status: '', source: '' })
  }

  // Eliminar cliente
  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      return
    }

    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al eliminar cliente')
      }

      // Recargar lista
      fetchCustomers(pagination.page)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  // Paginación
  const handlePageChange = (newPage: number) => {
    fetchCustomers(newPage)
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gestión de clientes y contactos</p>
        </div>

        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => fetchCustomers()} variant="outline">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">
            Gestión de clientes y contactos
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Añadir Cliente</span>
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status */}
            <select 
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Todos los estados</option>
              <option value="LEAD">Lead</option>
              <option value="CONTACT">Contacto</option>
              <option value="QUALIFIED">Calificado</option>
              <option value="CUSTOMER">Cliente</option>
              <option value="INACTIVE">Inactivo</option>
            </select>

            {/* Source */}
            <select 
              value={filters.source}
              onChange={(e) => handleFilterChange('source', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Todas las fuentes</option>
              <option value="chat">Chat</option>
              <option value="sheets">Google Sheets</option>
              <option value="manual">Manual</option>
            </select>

            {/* Clear filters */}
            <Button onClick={clearFilters} variant="outline" className="w-full">
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Clientes ({pagination.total})</span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-muted rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-1/3"></div>
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
                  </div>
                  <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No se encontraron clientes</p>
              <p className="text-sm text-muted-foreground">
                {Object.values(filters).some(v => v) ? 'Intenta ajustar los filtros' : 'Añade tu primer cliente para comenzar'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {customers.map((customer) => (
                <div 
                  key={customer.id} 
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedCustomer(customer)
                    setShowModal(true)
                  }}
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-primary-foreground">
                      {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-foreground truncate">
                        {customer.name}
                      </h3>
                      <Badge className={getStatusColor(customer.status)}>
                        {getStatusText(customer.status)}
                      </Badge>
                      <Badge variant="outline" className={getSourceColor(customer.source)}>
                        {getSourceText(customer.source)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{customer.email}</span>
                      </span>
                      
                      {customer.phone && (
                        <span className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{customer.phone}</span>
                        </span>
                      )}
                      
                      {customer.company && (
                        <span className="flex items-center space-x-1">
                          <Building className="h-3 w-3" />
                          <span className="truncate">{customer.company}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{customer._count.conversations} conversaciones</p>
                    <p>{formatRelativeTime(customer.createdAt)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost" onClick={(e) => {
                      e.stopPropagation()
                      // TODO: Implement edit
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteCustomer(customer.id)
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Página {pagination.page} de {pagination.totalPages} ({pagination.total} total)
              </p>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Anterior
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={!pagination.hasMore}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
