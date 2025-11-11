import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UpdateCustomerSchema } from '@/lib/validations'

// GET - Obtener un cliente específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        conversations: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10, // Últimas 10 conversaciones
        },
        sheetSyncs: {
          orderBy: {
            lastSyncedAt: 'desc',
          },
        },
        _count: {
          select: {
            conversations: true,
            sheetSyncs: true,
          },
        },
      },
    })

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cliente no encontrado',
          message: 'El cliente especificado no existe',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      customer,
      message: 'Cliente obtenido exitosamente',
    })

  } catch (error) {
    console.error('Error fetching customer:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo obtener el cliente',
      },
      { status: 500 }
    )
  }
}

// PUT - Actualizar un cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    // Validar datos de entrada
    const updates = UpdateCustomerSchema.parse({ ...body, id })

    // Verificar que el cliente existe
    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
    })

    if (!existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cliente no encontrado',
          message: 'El cliente especificado no existe',
        },
        { status: 404 }
      )
    }

    // Verificar email único si se está actualizando
    if (updates.email && updates.email !== existingCustomer.email) {
      const emailExists = await prisma.customer.findUnique({
        where: {
          email: updates.email,
          NOT: { id },
        },
      })

      if (emailExists) {
        return NextResponse.json(
          {
            success: false,
            error: 'Email ya registrado',
            message: 'Ya existe otro cliente con este email',
          },
          { status: 409 }
        )
      }
    }

    // Verificar teléfono único si se está actualizando
    if (updates.phone && updates.phone !== existingCustomer.phone) {
      const phoneExists = await prisma.customer.findUnique({
        where: {
          phone: updates.phone,
          NOT: { id },
        },
      })

      if (phoneExists) {
        return NextResponse.json(
          {
            success: false,
            error: 'Teléfono ya registrado',
            message: 'Ya existe otro cliente con este número de teléfono',
          },
          { status: 409 }
        )
      }
    }

    // Actualizar el cliente
    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        name: updates.name,
        email: updates.email,
        phone: updates.phone,
        company: updates.company,
        status: updates.status,
        notes: updates.notes,
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

    return NextResponse.json({
      success: true,
      customer: updatedCustomer,
      message: 'Cliente actualizado exitosamente',
    })

  } catch (error) {
    console.error('Error updating customer:', error)

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
        message: 'No se pudo actualizar el cliente',
      },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar un cliente
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Verificar que el cliente existe
    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            conversations: true,
            sheetSyncs: true,
          },
        },
      },
    })

    if (!existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cliente no encontrado',
          message: 'El cliente especificado no existe',
        },
        { status: 404 }
      )
    }

    // Eliminar el cliente (las relaciones se manejan automáticamente según el schema)
    await prisma.customer.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Cliente eliminado exitosamente',
      deletedCustomer: {
        id: existingCustomer.id,
        name: existingCustomer.name,
        email: existingCustomer.email,
        conversationsCount: existingCustomer._count.conversations,
        sheetSyncsCount: existingCustomer._count.sheetSyncs,
      },
    })

  } catch (error) {
    console.error('Error deleting customer:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo eliminar el cliente',
      },
      { status: 500 }
    )
  }
}
