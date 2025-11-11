import { prisma } from './prisma';

/**
 * Trigger n8n webhook para envío de mensaje de chat
 */
export async function triggerN8nWebhook(webhookPath: string, data: any) {
  const n8nUrl = process.env.N8N_WEBHOOK_URL;
  
  if (!n8nUrl) {
    throw new Error('N8N_WEBHOOK_URL not configured in environment variables');
  }

  const url = `${n8nUrl}/${webhookPath}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.WEBHOOK_SECRET && {
          'X-Webhook-Secret': process.env.WEBHOOK_SECRET
        })
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling n8n webhook:', error);
    throw error;
  }
}

/**
 * Envía mensaje de chat a n8n para procesamiento de IA
 */
export async function sendChatMessageToN8n(sessionId: string, message: string) {
  return triggerN8nWebhook('chat-message', {
    sessionId,
    message,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Trigger sincronización manual con Google Sheets
 */
export async function triggerSheetSync(sheetId?: string) {
  return triggerN8nWebhook('trigger-sync', {
    sheetId: sheetId || 'all',
    timestamp: new Date().toISOString(),
    source: 'manual',
  });
}

/**
 * Log webhook request para debugging
 */
export async function logWebhookRequest(
  endpoint: string,
  method: string,
  payload: any,
  headers?: any,
  statusCode: number = 200,
  response?: any,
  error?: string
) {
  try {
    await prisma.webhookLog.create({
      data: {
        endpoint,
        method,
        payload: payload || {},
        headers: headers || {},
        statusCode,
        response: response || null,
        error: error || null,
      },
    });
  } catch (logError) {
    // Si falla el log, solo mostramos error en consola para no afectar el flujo principal
    console.error('Failed to log webhook request:', logError);
  }
}

/**
 * Verifica la signature del webhook si está configurado
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string | undefined
): boolean {
  if (!process.env.WEBHOOK_SECRET) {
    // Si no hay secret configurado, aceptamos cualquier request
    return true;
  }

  if (!signature) {
    return false;
  }

  // En un entorno real aquí iría la verificación de firma HMAC
  // Para simplicidad, solo comparamos con el secret directo
  return signature === process.env.WEBHOOK_SECRET;
}

/**
 * Maneja errores de webhook y los registra
 */
export async function handleWebhookError(
  endpoint: string,
  method: string,
  payload: any,
  error: Error,
  headers?: any
) {
  await logWebhookRequest(
    endpoint,
    method,
    payload,
    headers,
    500,
    null,
    error.message
  );
  
  console.error(`Webhook error at ${endpoint}:`, error);
}

/**
 * Respuesta estándar para webhooks exitosos
 */
export function createWebhookSuccessResponse(data?: any) {
  return {
    success: true,
    timestamp: new Date().toISOString(),
    data: data || null,
  };
}

/**
 * Respuesta estándar para errores de webhook
 */
export function createWebhookErrorResponse(message: string, code?: string) {
  return {
    success: false,
    error: {
      message,
      code: code || 'WEBHOOK_ERROR',
      timestamp: new Date().toISOString(),
    },
  };
}
