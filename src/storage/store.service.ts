import { Injectable } from '@nestjs/common'
import {
  Booking,
  EventType,
  GuestContact,
  Slot,
} from '../domain/models'

@Injectable()
export class StoreService {
  private eventTypes: EventType[] = []
  private slots: Slot[] = []
  private bookings: Booking[] = []
  private eventTypeSeq = 1
  private slotSeq = 1
  private bookingSeq = 1

  constructor() {
    this.seed()
  }

  listEventTypes() {
    return [...this.eventTypes]
  }

  getEventType(id: string) {
    return this.eventTypes.find((item) => item.id === id)
  }

  createEventType(data: {
    title: string
    description?: string
    durationMinutes: number
  }): EventType {
    const eventType: EventType = {
      id: `evt_${this.eventTypeSeq++}`,
      title: data.title,
      description: data.description,
      durationMinutes: data.durationMinutes,
    }
    this.eventTypes.push(eventType)
    return eventType
  }

  listSlots() {
    return [...this.slots]
  }

  getSlot(id: string) {
    return this.slots.find((item) => item.id === id)
  }

  createSlot(data: {
    startAt: string
    endAt: string
    durationMinutes: number
  }): Slot {
    const slot: Slot = {
      id: `slot_${this.slotSeq++}`,
      startAt: data.startAt,
      endAt: data.endAt,
      durationMinutes: data.durationMinutes,
    }
    this.slots.push(slot)
    return slot
  }

  listBookings() {
    return [...this.bookings]
  }

  createBooking(data: {
    eventTypeId: string
    slotId: string
    startAt: string
    endAt: string
    createdAt: string
    guest?: GuestContact
  }): Booking {
    const booking: Booking = {
      id: `book_${this.bookingSeq++}`,
      eventTypeId: data.eventTypeId,
      slotId: data.slotId,
      startAt: data.startAt,
      endAt: data.endAt,
      createdAt: data.createdAt,
      guest: data.guest,
    }
    this.bookings.push(booking)
    return booking
  }

  private seed() {
    if (this.eventTypes.length > 0 || this.slots.length > 0) return

    const quick = this.createEventType({
      title: 'Быстрый созвон',
      description: 'Короткий статусный звонок на 30 минут.',
      durationMinutes: 30,
    })
    const deep = this.createEventType({
      title: 'Стратегическая сессия',
      description: 'Подробный разбор задачи и следующие шаги.',
      durationMinutes: 60,
    })

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const date = now.getDate()

    const seedSlot = (hour: number, minute: number, durationMinutes: number) => {
      const start = new Date(year, month, date, hour, minute, 0, 0)
      const end = new Date(start.getTime() + durationMinutes * 60_000)
      this.createSlot({
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        durationMinutes,
      })
    }

    seedSlot(9, 0, quick.durationMinutes)
    seedSlot(10, 0, quick.durationMinutes)
    seedSlot(11, 30, quick.durationMinutes)
    seedSlot(14, 0, quick.durationMinutes)

    seedSlot(12, 0, deep.durationMinutes)
    seedSlot(15, 0, deep.durationMinutes)
  }
}
