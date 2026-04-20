import { validationError } from './api-errors'

export const parseDateTime = (value: string, field: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw validationError(`Invalid ${field} date-time`, { field, value })
  }
  return date
}

export const parseOptionalDateTime = (value?: string, field?: string) => {
  if (!value) return undefined
  return parseDateTime(value, field ?? 'date')
}

export const ensureValidDateRange = (
  from?: Date,
  to?: Date,
  details?: { from?: string; to?: string },
) => {
  if (from && to && from.getTime() > to.getTime()) {
    throw validationError('Invalid date range: from is after to', details)
  }
}

export const computeEndAt = (start: Date, durationMinutes: number) =>
  new Date(start.getTime() + durationMinutes * 60_000)

export const ensureWithinWorkingHours = (
  start: Date,
  end: Date,
  details?: { startAt?: string; durationMinutes?: number },
) => {
  const startMinutes = start.getHours() * 60 + start.getMinutes()
  const endMinutes = end.getHours() * 60 + end.getMinutes()
  const sameDay = start.toDateString() === end.toDateString()

  const isInside =
    sameDay && startMinutes >= 9 * 60 && endMinutes <= 18 * 60

  if (!isInside) {
    throw validationError(
      'Slot must be within availability window 09:00-18:00 (local time)',
      details,
    )
  }
}

export const intervalsOverlap = (
  startA: number,
  endA: number,
  startB: number,
  endB: number,
) => startA < endB && startB < endA
