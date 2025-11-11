import { PrismaClient, CustomerStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Sembrando datos de ejemplo...')

  // Crear 10 clientes de ejemplo
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Juan Pérez García',
        email: 'juan.perez@email.com',
        phone: '+34612345678',
        company: 'Tech Solutions SL',
        status: CustomerStatus.CUSTOMER,
        source: 'chat',
        notes: 'Cliente muy interesado en nuestros servicios de automatización',
      }
    }),
    prisma.customer.create({
      data: {
        name: 'María González López',
        email: 'maria.gonzalez@empresa.com',
        phone: '+34687654321',
        company: 'Innovación Digital',
        status: CustomerStatus.QUALIFIED,
        source: 'sheets',
        notes: 'Contacto mediante Google Sheets, necesita más información',
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@startup.com',
        company: 'StartupXYZ',
        status: CustomerStatus.LEAD,
        source: 'chat',
        notes: 'Interesado en automatizar sus procesos de ventas',
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Ana Martín Ruiz',
        email: 'ana.martin@consultora.es',
        phone: '+34698765432',
        company: 'Consultora Estratégica',
        status: CustomerStatus.CONTACT,
        source: 'manual',
        notes: 'Derivado desde equipo comercial, seguimiento pendiente',
      }
    }),
    prisma.customer.create({
      data: {
        name: 'David López Sánchez',
        email: 'david.lopez@fintech.com',
        phone: '+34656789123',
        company: 'FinTech Innovations',
        status: CustomerStatus.CUSTOMER,
        source: 'chat',
        notes: 'Cliente recurrente, muy satisfecho con el servicio',
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Laura Fernández',
        email: 'laura.fernandez@ecommerce.com',
        company: 'E-commerce Plus',
        status: CustomerStatus.QUALIFIED,
        source: 'sheets',
        notes: 'Necesita integración con plataforma de e-commerce',
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Miguel Torres Vega',
        email: 'miguel.torres@logistica.es',
        phone: '+34633445566',
        company: 'Logística Avanzada',
        status: CustomerStatus.LEAD,
        source: 'chat',
        notes: 'Primera conversación, mostró interés inicial',
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Carmen Jiménez',
        email: 'carmen.jimenez@retail.com',
        company: 'Retail Solutions',
        status: CustomerStatus.INACTIVE,
        source: 'manual',
        notes: 'No respondió últimos contactos, marcar como inactivo',
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Roberto Morales',
        email: 'roberto.morales@manufacturing.com',
        phone: '+34677889900',
        company: 'Manufacturing Pro',
        status: CustomerStatus.CONTACT,
        source: 'chat',
        notes: 'Interesado en automatización de manufactura',
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Elena Castillo Ramos',
        email: 'elena.castillo@healthcare.es',
        phone: '+34644556677',
        company: 'HealthCare Systems',
        status: CustomerStatus.QUALIFIED,
        source: 'sheets',
        notes: 'Sector salud, necesita cumplir normativas específicas',
      }
    }),
  ])

  console.log(`✅ Creados ${customers.length} clientes`)

  // Crear sesiones de chat de ejemplo
  const chatSessions = await Promise.all([
    prisma.chatSession.create({
      data: {
        customerId: customers[0].id,
        isActive: true,
        lastMessageAt: new Date(),
        metadata: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ip: '192.168.1.100'
        }
      }
    }),
    prisma.chatSession.create({
      data: {
        customerId: customers[2].id,
        isActive: true,
        lastMessageAt: new Date(Date.now() - 5 * 60 * 1000), // hace 5 minutos
        metadata: {
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          ip: '192.168.1.101'
        }
      }
    }),
    prisma.chatSession.create({
      data: {
        isActive: true,
        lastMessageAt: new Date(Date.now() - 2 * 60 * 1000), // hace 2 minutos
        metadata: {
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
          ip: '192.168.1.102'
        }
      }
    }),
  ])

  console.log(`✅ Creadas ${chatSessions.length} sesiones de chat`)

  // Crear 20 conversaciones de ejemplo
  const conversations = [
    // Conversación con Juan Pérez
    {
      customerId: customers[0].id,
      userMessage: "Hola, estoy interesado en automatizar mis procesos de negocio",
      aiResponse: "¡Hola Juan! Me alegra escuchar eso. ¿Podrías contarme qué tipo de procesos te gustaría automatizar?",
      intent: "inquiry",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // hace 2 días
    },
    {
      customerId: customers[0].id,
      userMessage: "Principalmente el seguimiento de leads y la gestión de clientes",
      aiResponse: "Perfecto, tenemos excelentes soluciones para CRM y automatización de ventas. ¿Cuántos leads manejas aproximadamente al mes?",
      intent: "qualification",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
    },
    // Conversación con María González
    {
      customerId: customers[1].id,
      userMessage: "Buenos días, me llegó vuestra información por Google Sheets",
      aiResponse: "¡Buenos días María! Sí, veo que estás en nuestra lista de contactos interesados. ¿En qué podemos ayudarte?",
      intent: "follow_up",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // hace 1 día
    },
    {
      customerId: customers[1].id,
      userMessage: "Me interesa conocer más sobre vuestras integraciones con Google Workspace",
      aiResponse: "Excelente pregunta. Tenemos integraciones nativas con Google Sheets, Drive, Calendar y Gmail. ¿Qué herramientas usas actualmente?",
      intent: "product_info",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
    },
    // Conversación con Carlos Rodríguez
    {
      customerId: customers[2].id,
      userMessage: "Hola, soy Carlos. Tengo una startup y necesito automatizar mis ventas",
      aiResponse: "¡Hola Carlos! Genial que tengas una startup. Automatizar ventas desde el principio es una decisión muy inteligente. ¿Cuál es tu producto o servicio?",
      intent: "greeting",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // hace 12 horas
    },
    // Conversaciones recientes
    {
      customerId: customers[6].id,
      userMessage: "Buenos días, quería información sobre vuestros precios",
      aiResponse: "¡Buenos días Miguel! Me alegra tu interés. Tenemos diferentes planes según tus necesidades. ¿Podrías contarme un poco sobre tu empresa y qué procesos quieres automatizar?",
      intent: "pricing_inquiry",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // hace 3 horas
    },
    {
      customerId: customers[8].id,
      userMessage: "Hola, trabajo en manufactura y necesito optimizar la producción",
      aiResponse: "¡Hola Roberto! La manufactura es uno de nuestros sectores fuertes. Tenemos soluciones específicas para optimización de producción, control de calidad y gestión de inventario. ¿Qué área es tu prioridad?",
      intent: "industry_specific",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // hace 2 horas
    },
    // Más conversaciones variadas
    {
      customerId: customers[3].id,
      userMessage: "Hola, me derivaron desde comercial para hacer seguimiento",
      aiResponse: "¡Hola Ana! Sí, veo tu caso. Te fueron asignados como contacto cualificado. ¿Ya tuviste oportunidad de revisar la propuesta que te enviamos?",
      intent: "follow_up",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // hace 6 horas
    },
    {
      customerId: customers[4].id,
      userMessage: "Todo funciona perfecto, muy contento con el servicio",
      aiResponse: "¡Me alegra muchísimo escuchar eso David! Es genial saber que estás satisfecho. ¿Hay alguna nueva funcionalidad que te gustaría explorar?",
      intent: "customer_satisfaction",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // hace 4 horas
    },
    {
      customerId: customers[5].id,
      userMessage: "Necesito integrar mi tienda online con vuestro sistema",
      aiResponse: "¡Perfecto Laura! Tenemos conectores para las principales plataformas de e-commerce como Shopify, WooCommerce y Magento. ¿Qué plataforma usas?",
      intent: "integration_request",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // hace 5 horas
    },
    // Conversaciones muy recientes
    {
      customerId: customers[9].id,
      userMessage: "Buenas tardes, trabajo en el sector salud y tengo dudas sobre el cumplimiento normativo",
      aiResponse: "Buenas tardes Elena. Excelente pregunta, el cumplimiento es crucial en salud. Nuestras soluciones cumplen con GDPR y tenemos certificaciones específicas para el sector sanitario. ¿Qué normativas específicas necesitas cumplir?",
      intent: "compliance_inquiry",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // hace 1 hora
    },
    {
      customerId: null,
      userMessage: "Hola, me gustaría registrarme para recibir más información",
      aiResponse: "¡Hola! Perfecto, me alegra tu interés. Para poder ayudarte mejor, ¿podrías decirme tu nombre y email?",
      intent: "registration",
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // hace 30 minutos
    },
    {
      customerId: null,
      userMessage: "¿Qué tipos de automatización ofrecéis?",
      aiResponse: "Ofrecemos automatización en múltiples áreas: marketing (email campaigns, lead nurturing), ventas (CRM, seguimiento), operaciones (facturación, reportes) y atención al cliente (chatbots, tickets). ¿Alguna área te interesa más?",
      intent: "product_overview",
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // hace 15 minutos
    },
    // Conversaciones de demostración adicionales
    {
      customerId: customers[0].id,
      userMessage: "¿Cuánto tiempo toma implementar una solución completa?",
      aiResponse: "Excelente pregunta Juan. Dependiendo de la complejidad, una implementación básica toma 2-3 semanas, mientras que soluciones más avanzadas pueden tomar 6-8 semanas. ¿Tienes algún deadline específico?",
      intent: "implementation_timeline",
      createdAt: new Date(Date.now() - 45 * 60 * 1000), // hace 45 minutos
    },
    {
      customerId: customers[2].id,
      userMessage: "¿Ofrecéis soporte técnico en español?",
      aiResponse: "¡Por supuesto Carlos! Todo nuestro soporte técnico está disponible en español, 24/7. También ofrecemos documentación completa y videos tutoriales en español.",
      intent: "support_inquiry",
      createdAt: new Date(Date.now() - 25 * 60 * 1000), // hace 25 minutos
    },
    {
      customerId: customers[1].id,
      userMessage: "¿Podríamos agendar una demo personalizada?",
      aiResponse: "¡Absolutamente María! Me encantaría mostrarte una demo personalizada. ¿Qué tal si coordinamos una reunión para esta semana? ¿Tienes preferencia de día y hora?",
      intent: "demo_request",
      createdAt: new Date(Date.now() - 10 * 60 * 1000), // hace 10 minutos
    },
    {
      customerId: customers[4].id,
      userMessage: "Quería reportar que todo está funcionando excelente",
      aiResponse: "¡David, qué alegría escuchar eso! Comentarios como el tuyo nos motivan mucho. Si necesitas cualquier mejora o tienes sugerencias, no dudes en decírmelo.",
      intent: "positive_feedback",
      createdAt: new Date(Date.now() - 5 * 60 * 1000), // hace 5 minutos
    },
    {
      customerId: customers[6].id,
      userMessage: "¿Tienen algún plan especial para startups?",
      aiResponse: "¡Sí Miguel! Tenemos un programa especial para startups con descuentos significativos durante el primer año. También incluye mentoring técnico gratuito. ¿Tu startup está en etapa temprana?",
      intent: "startup_program",
      createdAt: new Date(Date.now() - 2 * 60 * 1000), // hace 2 minutos
    },
    {
      customerId: null,
      userMessage: "¿Puedo probar el sistema antes de contratar?",
      aiResponse: "¡Por supuesto! Ofrecemos una prueba gratuita de 14 días con acceso completo a todas las funcionalidades. ¿Te gustaría que te ayude a configurar tu cuenta de prueba?",
      intent: "trial_request",
      createdAt: new Date(Date.now() - 1 * 60 * 1000), // hace 1 minuto
    },
  ]

  for (const conv of conversations) {
    await prisma.conversation.create({ data: conv })
  }

  console.log(`✅ Creadas ${conversations.length} conversaciones`)

  // Crear algunos registros de sync con Google Sheets
  const sheetSyncs = await Promise.all([
    prisma.sheetSync.create({
      data: {
        customerId: customers[1].id, // María González
        sheetId: "1ABC123XYZ789",
        rowNumber: 2,
        lastSyncedAt: new Date(),
        syncStatus: "synced",
        data: {
          name: "María González López",
          email: "maria.gonzalez@empresa.com",
          phone: "+34687654321",
          company: "Innovación Digital",
          interest: "Google Workspace Integration"
        }
      }
    }),
    prisma.sheetSync.create({
      data: {
        customerId: customers[5].id, // Laura Fernández
        sheetId: "1ABC123XYZ789",
        rowNumber: 3,
        lastSyncedAt: new Date(Date.now() - 15 * 60 * 1000), // hace 15 minutos
        syncStatus: "synced",
        data: {
          name: "Laura Fernández",
          email: "laura.fernandez@ecommerce.com",
          company: "E-commerce Plus",
          interest: "E-commerce Integration"
        }
      }
    }),
    prisma.sheetSync.create({
      data: {
        customerId: customers[9].id, // Elena Castillo
        sheetId: "1ABC123XYZ789",
        rowNumber: 4,
        lastSyncedAt: new Date(Date.now() - 30 * 60 * 1000), // hace 30 minutos
        syncStatus: "pending",
        data: {
          name: "Elena Castillo Ramos",
          email: "elena.castillo@healthcare.es",
          phone: "+34644556677",
          company: "HealthCare Systems",
          interest: "Healthcare Compliance"
        }
      }
    })
  ])

  console.log(`✅ Creados ${sheetSyncs.length} registros de sincronización`)

  // Crear logs de webhooks de ejemplo
  const webhookLogs = await Promise.all([
    prisma.webhookLog.create({
      data: {
        endpoint: "/api/webhook/chat-response",
        method: "POST",
        payload: {
          sessionId: chatSessions[0].sessionToken,
          message: "Respuesta de IA procesada",
          intent: "greeting"
        },
        headers: {
          "content-type": "application/json",
          "user-agent": "n8n-webhook"
        },
        statusCode: 200,
        response: { success: true }
      }
    }),
    prisma.webhookLog.create({
      data: {
        endpoint: "/api/webhook/customer-registered",
        method: "POST",
        payload: {
          name: "Elena Castillo Ramos",
          email: "elena.castillo@healthcare.es",
          source: "sheets"
        },
        headers: {
          "content-type": "application/json",
          "user-agent": "n8n-webhook"
        },
        statusCode: 201,
        response: { customerId: customers[9].id }
      }
    }),
    prisma.webhookLog.create({
      data: {
        endpoint: "/api/webhook/sheets-updated",
        method: "POST",
        payload: {
          sheetId: "1ABC123XYZ789",
          updatedRows: 3,
          timestamp: new Date()
        },
        headers: {
          "content-type": "application/json",
          "user-agent": "n8n-webhook"
        },
        statusCode: 200,
        response: { processed: true }
      }
    })
  ])

  console.log(`✅ Creados ${webhookLogs.length} logs de webhook`)

  console.log('\n🎉 ¡Datos de ejemplo creados exitosamente!')
  console.log(`\n📊 Resumen:`)
  console.log(`   • ${customers.length} clientes`)
  console.log(`   • ${conversations.length} conversaciones`)
  console.log(`   • ${chatSessions.length} sesiones de chat`)
  console.log(`   • ${sheetSyncs.length} sincronizaciones de sheets`)
  console.log(`   • ${webhookLogs.length} logs de webhook`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
