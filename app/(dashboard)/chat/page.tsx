'use client'

import { useChat } from '@/lib/hooks/useChat'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, MessageCircle, User, Bot } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'

export default function ChatPage() {
  const { messages, isLoading, error, sessionId, sendMessage, clearError, startNewSession } = useChat()
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll al final cuando llegan nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputMessage.trim() || isLoading) return

    const messageToSend = inputMessage.trim()
    setInputMessage('')
    setIsTyping(true)

    try {
      await sendMessage(messageToSend)
    } finally {
      setIsTyping(false)
    }
  }

  const handleNewSession = () => {
    startNewSession()
  }

  return (
    <div className="space-y-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chat en Vivo</h1>
          <p className="text-muted-foreground">
            Conversaciones en tiempo real con IA
          </p>
        </div>
        <Button onClick={handleNewSession} variant="outline">
          Nueva Conversación
        </Button>
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
            <Button onClick={clearError} variant="outline" size="sm">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Chat Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Sessions List - TODO: Implement active sessions */}
        <Card className="hidden lg:block">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Sesiones Activas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sessionId ? (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm font-medium">Sesión Actual</p>
                  <p className="text-xs text-muted-foreground">{sessionId.slice(0, 8)}...</p>
                  <p className="text-xs text-muted-foreground">Activa</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hay sesiones activas</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>Chat IA</span>
              {isLoading && <span className="text-sm text-muted-foreground">(Enviando...)</span>}
            </CardTitle>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay mensajes aún</p>
                  <p className="text-sm">Escribe un mensaje para comenzar</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="flex items-start space-x-2 max-w-sm">
                        <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3">
                          <p className="text-sm">{message.userMessage}</p>
                        </div>
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                      </div>
                    </div>

                    {/* AI Response */}
                    {message.aiResponse && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-2 max-w-sm">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="bg-muted text-muted-foreground rounded-2xl rounded-bl-md px-4 py-3">
                            <p className="text-sm">{message.aiResponse}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-sm">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading || !sessionId}
                className="flex-1"
                maxLength={1000}
              />
              <Button 
                type="submit" 
                disabled={isLoading || !inputMessage.trim() || !sessionId}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>

            {!sessionId && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Creando sesión de chat...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
