import { z } from 'zod';

// Esquema para validar clientes
export const CustomerSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(['LEAD', 'CONTACT', 'QUALIFIED', 'CUSTOMER', 'INACTIVE']),
  notes: z.string().optional(),
});

// Esquema para crear cliente
export const CreateCustomerSchema = CustomerSchema.extend({
  source: z.string().default('manual'),
});

// Esquema para actualizar cliente
export const UpdateCustomerSchema = CustomerSchema.partial().extend({
  id: z.string().cuid(),
});

// Esquema para mensajes de chat
export const ChatMessageSchema = z.object({
  message: z.string().min(1, 'El mensaje no puede estar vacío').max(1000, 'Mensaje muy largo'),
  sessionId: z.string().cuid('ID de sesión inválido'),
});

// Esquema para nueva sesión de chat
export const NewChatSessionSchema = z.object({
  metadata: z.object({
    userAgent: z.string().optional(),
    ip: z.string().optional(),
  }).optional(),
});

// Esquema para webhook de respuesta de chat desde n8n
export const WebhookChatResponseSchema = z.object({
  sessionId: z.string().cuid('ID de sesión inválido'),
  userMessage: z.string(),
  aiResponse: z.string(),
  intent: z.string().optional(),
  customerData: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
  }).optional(),
});

// Esquema para webhook de cliente registrado desde n8n
export const WebhookCustomerRegisteredSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  company: z.string().optional(),
  source: z.string().default('sheets'),
  notes: z.string().optional(),
});

// Esquema para webhook de sheets actualizadas desde n8n
export const WebhookSheetsUpdatedSchema = z.object({
  sheetId: z.string().min(1, 'ID de sheet requerido'),
  customers: z.array(z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    company: z.string().optional(),
    rowNumber: z.number().optional(),
  })),
  timestamp: z.string().datetime().optional(),
});

// Esquema para filtros de clientes
export const CustomerFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['LEAD', 'CONTACT', 'QUALIFIED', 'CUSTOMER', 'INACTIVE']).optional(),
  source: z.enum(['chat', 'sheets', 'manual']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

// Esquema para parámetros de dashboard
export const DashboardStatsSchema = z.object({
  days: z.coerce.number().min(1).max(90).default(7),
});

// Esquema para trigger de sincronización manual
export const TriggerSyncSchema = z.object({
  sheetId: z.string().optional(), // Si no se proporciona, sincroniza todos
  force: z.boolean().default(false),
});

// Types derivados de los esquemas
export type Customer = z.infer<typeof CustomerSchema>;
export type CreateCustomer = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomer = z.infer<typeof UpdateCustomerSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type NewChatSession = z.infer<typeof NewChatSessionSchema>;
export type WebhookChatResponse = z.infer<typeof WebhookChatResponseSchema>;
export type WebhookCustomerRegistered = z.infer<typeof WebhookCustomerRegisteredSchema>;
export type WebhookSheetsUpdated = z.infer<typeof WebhookSheetsUpdatedSchema>;
export type CustomerFilters = z.infer<typeof CustomerFiltersSchema>;
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
export type TriggerSync = z.infer<typeof TriggerSyncSchema>;
