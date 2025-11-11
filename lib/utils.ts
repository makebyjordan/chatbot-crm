import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility para combinar clases CSS de forma inteligente
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea una fecha a formato relativo (ej: "hace 2 minutos")
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffMs = now.getTime() - targetDate.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffWeek = Math.floor(diffDay / 7)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (diffSec < 60) {
    return diffSec < 5 ? 'ahora mismo' : `hace ${diffSec} segundos`
  } else if (diffMin < 60) {
    return diffMin === 1 ? 'hace 1 minuto' : `hace ${diffMin} minutos`
  } else if (diffHour < 24) {
    return diffHour === 1 ? 'hace 1 hora' : `hace ${diffHour} horas`
  } else if (diffDay < 7) {
    return diffDay === 1 ? 'hace 1 día' : `hace ${diffDay} días`
  } else if (diffWeek < 4) {
    return diffWeek === 1 ? 'hace 1 semana' : `hace ${diffWeek} semanas`
  } else if (diffMonth < 12) {
    return diffMonth === 1 ? 'hace 1 mes' : `hace ${diffMonth} meses`
  } else {
    return diffYear === 1 ? 'hace 1 año' : `hace ${diffYear} años`
  }
}

/**
 * Formatea una fecha en formato español (ej: "15 ene 2025, 14:30")
 */
export function formatDateTime(date: Date | string): string {
  const targetDate = new Date(date)
  
  return targetDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Formatea solo la fecha en formato español (ej: "15 enero 2025")
 */
export function formatDate(date: Date | string): string {
  const targetDate = new Date(date)
  
  return targetDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Formatea solo la hora en formato español (ej: "14:30")
 */
export function formatTime(date: Date | string): string {
  const targetDate = new Date(date)
  
  return targetDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Capitaliza la primera letra de una string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Trunca un texto con puntos suspensivos
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

/**
 * Convierte un CustomerStatus a un texto legible en español
 */
export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'LEAD': 'Lead',
    'CONTACT': 'Contacto',
    'QUALIFIED': 'Calificado',
    'CUSTOMER': 'Cliente',
    'INACTIVE': 'Inactivo',
  }
  
  return statusMap[status] || status
}

/**
 * Obtiene el color del badge según el status del cliente
 */
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    'LEAD': 'bg-blue-100 text-blue-800 border-blue-200',
    'CONTACT': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'QUALIFIED': 'bg-orange-100 text-orange-800 border-orange-200',
    'CUSTOMER': 'bg-green-100 text-green-800 border-green-200',
    'INACTIVE': 'bg-gray-100 text-gray-800 border-gray-200',
  }
  
  return colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

/**
 * Convierte el source de cliente a texto legible
 */
export function getSourceText(source: string): string {
  const sourceMap: Record<string, string> = {
    'chat': 'Chat',
    'sheets': 'Google Sheets',
    'manual': 'Manual',
  }
  
  return sourceMap[source] || source
}

/**
 * Obtiene el color del badge según el source del cliente
 */
export function getSourceColor(source: string): string {
  const colorMap: Record<string, string> = {
    'chat': 'bg-purple-100 text-purple-800 border-purple-200',
    'sheets': 'bg-green-100 text-green-800 border-green-200',
    'manual': 'bg-blue-100 text-blue-800 border-blue-200',
  }
  
  return colorMap[source] || 'bg-gray-100 text-gray-800 border-gray-200'
}

/**
 * Formatea un número con separadores de miles
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-ES').format(num)
}

/**
 * Calcula el porcentaje y lo formatea
 */
export function formatPercentage(current: number, total: number, decimals = 1): string {
  if (total === 0) return '0%'
  const percentage = (current / total) * 100
  return `${percentage.toFixed(decimals)}%`
}

/**
 * Genera iniciales de un nombre
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/**
 * Valida si una cadena es un email válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida si una cadena es un teléfono español válido
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+34|0034|34)?[6789]\d{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Limpia y formatea un número de teléfono español
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, '')
  
  // Si ya tiene prefijo internacional, lo conservamos
  if (cleaned.startsWith('+34')) {
    return cleaned
  }
  
  // Si tiene 9 dígitos y empieza por 6, 7, 8, o 9, añadimos +34
  if (cleaned.length === 9 && /^[6789]/.test(cleaned)) {
    return `+34${cleaned}`
  }
  
  return phone // Si no cumple formato esperado, devolvemos original
}

/**
 * Debounce function para búsquedas
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}
