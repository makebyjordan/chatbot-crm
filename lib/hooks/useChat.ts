import { useState, useEffect, useCallback, useRef } from 'react'
import { sendChatMessageToN8n } from '../n8n'

type Message = {
  id: string
  userMessage: string
  aiResponse?: string
  timestamp: Date
  isLoading?: boolean
}

type ChatSession = {
  id: string
  sessionToken: string
  isActive: boolean
  lastMessageAt: Date
}

type UseChatReturn = {
  messages: Message[]
  isLoading: boolean
  error: string | null
  sessionId: string | null
  sendMessage: (message: string) => Promise<void>
  clearError: () => void
  startNewSession: () => Promise<void>
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Función para obtener historial de mensajes
  const fetchChatHistory = useCallback(async (sessionToken: string) => {
    try {
      const response = await fetch(`/api/chat/history?sessionId=${sessionToken}`)
      
      if (!response.ok) {
        throw new Error('Error al obtener historial')
      }

      const data = await response.json()
      
      if (data.success && data.conversations) {
        const formattedMessages: Message[] = data.conversations.map((conv: any) => ({
          id: conv.id,
          userMessage: conv.userMessage,
          aiResponse: conv.aiResponse,
          timestamp: new Date(conv.createdAt),
        }))
        
        setMessages(formattedMessages)
      }
    } catch (err) {
      console.error('Error fetching chat history:', err)
      setError('Error al cargar el historial de chat')
    }
  }, [])

  // Función para crear nueva sesión
  const startNewSession = useCallback(async () => {
    try {
      setError(null)
      setIsLoading(true)

      const response = await fetch('/api/chat/new-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metadata: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Error al crear sesión')
      }

      const data = await response.json()
      
      if (data.success) {
        setSessionId(data.sessionToken)
        setMessages([])
        // Iniciar polling para esta sesión
        startPolling(data.sessionToken)
      } else {
        throw new Error(data.error || 'Error desconocido')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear sesión')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Función para enviar mensaje
  const sendMessage = useCallback(async (message: string) => {
    if (!sessionId) {
      setError('No hay sesión activa')
      return
    }

    const tempId = Date.now().toString()
    
    try {
      setError(null)
      setIsLoading(true)

      // Añadir mensaje del usuario inmediatamente (optimistic update)
      const userMessage: Message = {
        id: tempId,
        userMessage: message,
        timestamp: new Date(),
        isLoading: true,
      }
      
      setMessages((prev: Message[]) => [...prev, userMessage])

      // Enviar a API
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          sessionId,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al enviar mensaje')
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Error al procesar mensaje')
      }

      // El polling se encargará de actualizar con la respuesta real
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar mensaje')
      // Remover mensaje temporal en caso de error
      setMessages((prev: Message[]) => prev.filter((m: Message) => m.id !== tempId))
    } finally {
      setIsLoading(false)
    }
  }, [sessionId])

  // Función para iniciar polling
  const startPolling = useCallback((sessionToken: string) => {
    // Detener polling anterior si existe
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }

    // Obtener historial inicial
    fetchChatHistory(sessionToken)

    // Iniciar polling cada 3 segundos
    pollingIntervalRef.current = setInterval(() => {
      fetchChatHistory(sessionToken)
    }, 3000)
  }, [fetchChatHistory])

  // Función para detener polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }, [])

  // Función para limpiar errores
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Inicializar sesión al montar el componente
  useEffect(() => {
    startNewSession()
    
    // Cleanup al desmontar
    return () => {
      stopPolling()
    }
  }, [])

  // Detener polling si el componente se desmonta
  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, [stopPolling])

  return {
    messages,
    isLoading,
    error,
    sessionId,
    sendMessage,
    clearError,
    startNewSession,
  }
}
