# 🤖 Chatbot CRM Dashboard

Una aplicación completa de CRM con chatbot IA y sincronización en tiempo real con Google Sheets. Construida con Next.js 14, React 18, TypeScript, Prisma y n8n.

## ✨ Características

### 🎯 Funcionalidades Principales
- **Dashboard en Tiempo Real** - Estadísticas y métricas de clientes y conversaciones
- **Chatbot IA Integrado** - Conversaciones en tiempo real con IA via n8n
- **CRUD Completo de Clientes** - Gestión completa de clientes con validaciones
- **Sincronización Google Sheets** - Sincronización bidireccional automática
- **Modo Oscuro** - Toggle de tema con persistencia
- **Responsive Design** - Optimizado para móvil, tablet y desktop
- **Real-time Polling** - Actualizaciones cada 3 segundos
- **Webhooks n8n** - Integración completa con n8n para automatización

### 🛠️ Tecnologías

**Frontend:**
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons

**Backend:**
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- Zod (validaciones)
- React Hook Form

**Integraciones:**
- n8n (automatización)
- Google Sheets API
- Webhooks

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+ 
- Cuenta en Supabase (reemplaza PostgreSQL local)
- n8n (opcional para IA)

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd primera
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Supabase (Opción A - Automática)**
```bash
npm run setup:supabase
```
*Te guiará paso a paso para ingresar tus credenciales de Supabase*

**Configurar Supabase (Opción B - Manual)**
```bash
cp .env.example .env
```
Editar `.env` con tus credenciales de Supabase (ver `SUPABASE_SETUP.md`)

4. **Configurar base de datos**
```bash
npm run setup:complete
```
*Esto ejecuta automáticamente: prisma generate + db push + seed*

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
primera/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Layout del dashboard
│   │   ├── page.tsx            # Página principal
│   │   ├── chat/               # Chat en vivo
│   │   ├── clientes/           # Gestión de clientes
│   │   └── sheets/             # Sincronización Sheets
│   ├── api/
│   │   ├── dashboard/          # API dashboard
│   │   ├── chat/               # API chat
│   │   ├── customers/          # API clientes
│   │   ├── sheets/             # API Google Sheets
│   │   └── webhook/            # Webhooks n8n
│   ├── globals.css             # Estilos globales
│   └── layout.tsx              # Layout raíz
├── components/
│   ├── ui/                     # Componentes shadcn/ui
│   └── layout/                 # Componentes de layout
├── lib/
│   ├── hooks/                  # React hooks personalizados
│   ├── prisma.ts              # Cliente Prisma
│   ├── validations.ts         # Esquemas Zod
│   ├── n8n.ts                 # Integración n8n
│   └── utils.ts               # Utilidades
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   └── seed.ts                # Datos de ejemplo
└── package.json
```

## 🎨 Páginas y Funcionalidades

### 🏠 Dashboard Principal (`/`)
- **Estadísticas en tiempo real** de clientes y conversaciones
- **Actividad reciente** con conversaciones y registros
- **Métricas clave**: total clientes, nuevos hoy, tasa de conversión
- **Auto-refresh** cada 3 segundos

### 💬 Chat en Vivo (`/chat`)
- **Interface de chat en tiempo real** con IA
- **Polling automático** cada 3 segundos
- **Sesiones de chat** persistentes
- **Integración n8n** para respuestas IA
- **Fallback inteligente** cuando n8n no está disponible
- **Indicadores de escritura** y estados de carga

### 👥 Gestión de Clientes (`/clientes`)
- **CRUD completo** de clientes
- **Búsqueda y filtros** avanzados
- **Validaciones Zod** en tiempo real
- **Paginación** eficiente
- **Estados y fuentes** configurables
- **Exportación** de datos

### 📊 Google Sheets (`/sheets`)
- **Sincronización automática** bidireccional
- **Status de sincronización** en tiempo real
- **Trigger manual** de sincronización
- **Logs de errores** detallados
- **Configuración visual** paso a paso

## 🔌 API Routes

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas del dashboard
- `GET /api/dashboard/recent-activity` - Actividad reciente

### Chat
- `POST /api/chat/new-session` - Nueva sesión de chat
- `POST /api/chat/send` - Enviar mensaje
- `GET /api/chat/history` - Historial de conversación

### Clientes
- `GET /api/customers` - Lista de clientes (con filtros)
- `POST /api/customers` - Crear cliente
- `GET /api/customers/[id]` - Obtener cliente
- `PUT /api/customers/[id]` - Actualizar cliente
- `DELETE /api/customers/[id]` - Eliminar cliente

### Google Sheets
- `GET /api/sheets/sync-status` - Estado de sincronización
- `GET /api/sheets/data` - Datos sincronizados
- `POST /api/sheets/trigger-sync` - Trigger sincronización

### Webhooks
- `POST /api/webhook/chat-response` - Respuesta de n8n

## 🗃️ Base de Datos

### Modelos Prisma

**Customer** - Clientes del CRM
- Información personal y de contacto
- Estados: LEAD, CONTACT, QUALIFIED, CUSTOMER, INACTIVE
- Fuentes: chat, sheets, manual

**Conversation** - Conversaciones del chat
- Mensajes de usuario y respuestas IA
- Intención detectada
- Plataforma de origen

**ChatSession** - Sesiones de chat
- Tokens únicos de sesión
- Estado activo/inactivo
- Metadata personalizada

**SheetSync** - Sincronización Sheets
- Estado de sincronización
- Logs de errores
- Datos sincronizados

**WebhookLog** - Logs de webhooks
- Registros de llamadas n8n
- Debugging y monitoreo

## ⚙️ Configuración n8n

### Workflow de Chat
1. **Webhook Trigger** - Recibe mensajes del chat
2. **Procesamiento IA** - OpenAI/Claude para respuestas
3. **Webhook Response** - Envía respuesta de vuelta

### Workflow Google Sheets
1. **Trigger Schedule** - Cada 5 minutos
2. **Read Google Sheets** - Lee datos del sheet
3. **Webhook CRM** - Actualiza base de datos
4. **Error Handling** - Manejo de errores

## 🎯 Validaciones

### Esquemas Zod
- **CustomerSchema** - Validación de clientes
- **ChatMessageSchema** - Validación de mensajes
- **WebhookSchema** - Validación de webhooks
- **FilterSchemas** - Validación de filtros y búsquedas

### Características de Validación
- **Validación en tiempo real** en formularios
- **Mensajes de error descriptivos**
- **Validación del lado servidor** en APIs
- **Sanitización de datos** de entrada

## 🔒 Seguridad

- **Verificación de signatures** en webhooks
- **Validación de entrada** con Zod
- **Sanitización** de datos SQL
- **Rate limiting** en APIs (recomendado)
- **Autenticación** (pendiente implementar)

## 📱 Responsive Design

- **Mobile First** - Optimizado para móviles
- **Tablet Friendly** - Adaptación para tablets
- **Desktop Enhanced** - Funcionalidades completas
- **Sidebar Collapsible** - Navegación adaptiva

## 🌙 Dark Mode

- **Toggle persistente** con localStorage
- **Smooth animations** en transiciones
- **Sistema de colores** personalizado
- **Auto-detection** del tema del sistema

## ⚡ Rendimiento

- **Real-time Polling** eficiente cada 3 segundos
- **Optimistic Updates** en chat
- **Lazy Loading** de componentes
- **Consultas optimizadas** con Prisma
- **Caching** de respuestas API

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén implementados)
npm test

# Linting
npm run lint

# Build para producción
npm run build
```

## 🚀 Deployment

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t chatbot-crm .
docker run -p 3000:3000 chatbot-crm
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

Para soporte y preguntas:
- Crear un **Issue** en GitHub
- Documentación en **Wiki**
- Email: soporte@chatbot-crm.com

---

**Hecho con ❤️ para automatizar tu CRM con IA**
