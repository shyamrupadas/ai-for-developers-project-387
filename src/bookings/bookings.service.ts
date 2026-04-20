import { Injectable } from '@nestjs/common'
import {
  ensureValidDateRange,
  intervalsOverlap,
  parseOptionalDateTime,
} from '../common/datetime'
import {
  bookingConflictError,
  notFoundError,
  validationError,
} from '../common/api-errors'
import { Booking, BookingView, GuestContact } from '../domain/models'
import { StoreService } from '../storage/store.service'

@Injectable()
export class BookingsService {
  constructor(private readonly store: StoreService) {}

  create(data: {
    eventTypeId: string
    slotId: string
    guest?: GuestContact
  }): Booking {
    const eventType = this.store.getEventType(data.eventTypeId)
    if (!eventType) {
      throw notFoundError('Event type not found', {
        eventTypeId: data.eventTypeId,
      })
    }

    const slot = this.store.getSlot(data.slotId)
    if (!slot) {
      throw notFoundError('Slot not found', { slotId: data.slotId })
    }

    if (slot.durationMinutes !== eventType.durationMinutes) {
      throw validationError('Slot duration does not match event type', {
        slotId: data.slotId,
        eventTypeId: data.eventTypeId,
      })
    }

    const slotStart = new Date(slot.startAt).getTime()
    const slotEnd = new Date(slot.endAt).getTime()

    const hasConflict = this.store.listBookings().some((booking) => {
      const bookingStart = new Date(booking.startAt).getTime()
      const bookingEnd = new Date(booking.endAt).getTime()
      return intervalsOverlap(slotStart, slotEnd, bookingStart, bookingEnd)
    })

    if (hasConflict) {
      throw bookingConflictError('Booking interval conflicts with existing one', {
        slotId: data.slotId,
      })
    }

    const guest = this.normalizeGuest(data.guest)

    return this.store.createBooking({
      eventTypeId: eventType.id,
      slotId: slot.id,
      startAt: slot.startAt,
      endAt: slot.endAt,
      createdAt: new Date().toISOString(),
      guest,
    })
  }

  listAdmin(from?: string, to?: string): BookingView[] {
    const fromDate = parseOptionalDateTime(from, 'from') ?? new Date()
    const toDate = parseOptionalDateTime(to, 'to')
    ensureValidDateRange(fromDate, toDate, { from, to })

    return this.store
      .listBookings()
      .filter((booking) => {
        const startAt = new Date(booking.startAt).getTime()
        if (startAt < fromDate.getTime()) return false
        if (toDate && startAt > toDate.getTime()) return false
        return true
      })
      .map((booking) => {
        const eventType = this.store.getEventType(booking.eventTypeId)
        if (!eventType) {
          throw notFoundError('Event type not found', {
            eventTypeId: booking.eventTypeId,
          })
        }

        return {
          id: booking.id,
          startAt: booking.startAt,
          endAt: booking.endAt,
          createdAt: booking.createdAt,
          slotId: booking.slotId,
          eventType: {
            id: eventType.id,
            title: eventType.title,
            durationMinutes: eventType.durationMinutes,
          },
          guest: booking.guest,
        }
      })
      .sort((a, b) => a.startAt.localeCompare(b.startAt))
  }

  private normalizeGuest(guest?: GuestContact): GuestContact | undefined {
    if (!guest) return undefined
    const name = guest.name?.trim() || undefined
    const email = guest.email?.trim() || undefined
    if (!name && !email) return undefined
    return { name, email }
  }
}
