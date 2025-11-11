import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chatbot CRM Dashboard',
  description: 'Sistema completo de chatbot IA con CRM en tiempo real',
  keywords: ['CRM', 'chatbot', 'IA', 'automatización', 'n8n'],
  authors: [{ name: 'Chatbot CRM Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
