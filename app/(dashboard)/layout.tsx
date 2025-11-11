'use client'

import { DarkModeProvider } from '@/lib/hooks/useDarkMode'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main content area */}
          <div className="flex-1 lg:ml-64">
            {/* Header */}
            <Header />
            
            {/* Page content */}
            <main className="p-6">
              <div className="mx-auto max-w-7xl">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </DarkModeProvider>
  )
}
