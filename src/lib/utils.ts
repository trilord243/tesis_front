import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isValid, parseISO } from "date-fns"
import { es } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely formats a date string or Date object.
 * Returns a fallback string if the date is invalid.
 */
export function formatDateSafe(
  dateInput: string | Date | undefined | null,
  formatStr: string = "d 'de' MMMM 'de' yyyy",
  fallback: string = "Fecha no disponible"
): string {
  if (!dateInput) return fallback

  try {
    const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput
    if (!isValid(date)) return fallback
    return format(date, formatStr, { locale: es })
  } catch {
    return fallback
  }
}

/**
 * Formats a date with time (for createdAt timestamps)
 */
export function formatDateTimeSafe(
  dateInput: string | Date | undefined | null,
  fallback: string = "Fecha no disponible"
): string {
  return formatDateSafe(dateInput, "d 'de' MMMM 'de' yyyy, HH:mm", fallback)
}

/**
 * Formats a reservation date (YYYY-MM-DD format from backend)
 * Adds noon time to avoid timezone issues
 */
export function formatReservationDate(
  dateString: string | undefined | null,
  fallback: string = "Fecha no disponible"
): string {
  if (!dateString) return fallback

  try {
    // For YYYY-MM-DD dates, add noon time to avoid timezone issues
    const date = new Date(dateString + "T12:00:00")
    if (!isValid(date)) return fallback
    return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
  } catch {
    return fallback
  }
}
