export type DateTimeString = string
export type Id = string
export type EventTypeId = string
export type SlotId = string
export type BookingId = string

export type GuestContact = {
  name?: string
  email?: string
}

export type EventType = {
  id: EventTypeId
  title: string
  description?: string
  durationMinutes: number
}

export type Slot = {
  id: SlotId
  startAt: DateTimeString
  endAt: DateTimeString
  durationMinutes: number
}

export type Booking = {
  id: BookingId
  eventTypeId: EventTypeId
  slotId: SlotId
  startAt: DateTimeString
  endAt: DateTimeString
  createdAt: DateTimeString
  guest?: GuestContact
}

export type EventTypeSummary = {
  id: EventTypeId
  title: string
  durationMinutes: number
}

export type BookingView = {
  id: BookingId
  startAt: DateTimeString
  endAt: DateTimeString
  createdAt: DateTimeString
  slotId: SlotId
  eventType: EventTypeSummary
  guest?: GuestContact
}
