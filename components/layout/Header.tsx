'use client'

import { useDarkMode } from '@/lib/hooks/useDarkMode'
import { Moon, Sun, Bell, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Mobile menu button - Left side */}
        <div className="flex items-center lg:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </div>

        {/* Page title - Center on mobile, left on desktop */}
        <div className="flex-1 lg:flex-none">
          <h2 className="text-lg font-semibold text-foreground lg:hidden">
            CRM Dashboard
          </h2>
        </div>

        {/* Actions - Right side */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive">
              <span className="sr-only">Nuevas notificaciones</span>
            </span>
          </Button>

          {/* Dark mode toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode}
            className="transition-transform hover:scale-110"
          >
            {isDarkMode ? (
              <>
                <Sun className="h-5 w-5" />
                <span className="sr-only">Activar modo claro</span>
              </>
            ) : (
              <>
                <Moon className="h-5 w-5" />
                <span className="sr-only">Activar modo oscuro</span>
              </>
            )}
          </Button>

          {/* User menu */}
          <div className="ml-4 flex items-center">
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-foreground">
                  Administrador
                </p>
                <p className="text-xs text-muted-foreground">
                  admin@crm.com
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">
                  A
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
