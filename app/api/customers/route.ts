import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CustomerFiltersSchema, CreateCustomerSchema } from '@/lib/validations'

// GET - Obtener lista de clientes con filtros y paginación
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    
    // Validar y parsear parámetros
    const { search, status, source, page, limit } = CustomerFiltersSchema.parse(queryParams)

    // Construir filtros dinámicamente
    const where: any = {}
    
    // Filtro de búsqueda (nombre, email, teléfono)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Filtros específicos
    if (status) {
      where.status = status
    }

    if (source) {
      where.source = source
    }

    // Calcular offset para paginación
    const offset = (page - 1) * limit

    // Obtener clientes y total en paralelo
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
        take: limit,
        include: {
          _count: {
            select: {
              conversations: true,
              sheetSyncs: true,
            },
          },
        },
      }),
      prisma.customer.count({ where }),
    ])

    // Calcular metadatos de paginación
    const totalPages = Math.ceil(total / limit)
    const hasMore = page < totalPages

    return NextResponse.json({
      success: true,
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore,
      },
      message: 'Clientes obtenidos exitosamente',
    })

  } catch (error) {
    console.error('Error fetching customers:', error)

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

    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener los clientes',
      },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos del cliente
    const customerData = CreateCustomerSchema.parse(body)

    // Verificar que el email no esté en uso
    const existingCustomer = await prisma.customer.findUnique({
      where: {
        email: customerData.email,
      },
    })

    if (existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email ya registrado',
          message: 'Ya existe un cliente con este email',
        },
        { status: 409 }
      )
    }

    // Verificar teléfono si se proporciona
    if (customerData.phone) {
      const existingPhone = await prisma.customer.findUnique({
        where: {
          phone: customerData.phone,
        },
      })

      if (existingPhone) {
        return NextResponse.json(
          {
            success: false,
            error: 'Teléfono ya registrado',
            message: 'Ya existe un cliente con este número de teléfono',
          },
          { status: 409 }
        )
      }
    }

    // Crear el cliente
    const customer = await prisma.customer.create({
      data: {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone || null,
        company: customerData.company || null,
        status: customerData.status,
        source: customerData.source,
        notes: customerData.notes || null,
      },
      include: {
        _count: {
          select: {
            conversations: true,
            sheetSyncs: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        customer,
        message: 'Cliente creado exitosamente',
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating customer:', error)

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
        message: 'No se pudo crear el cliente',
      },
      { status: 500 }
    )
  }
}
