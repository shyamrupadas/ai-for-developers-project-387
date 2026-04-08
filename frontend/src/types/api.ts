export type DateTimeString = string
export type Id = string
export type EventTypeId = string
export type SlotId = string
export type BookingId = string

export type Owner = {
  id: Id
  displayName: string
}

export type EventType = {
  id: EventTypeId
  title: string
  description?: string
  durationMinutes: number
}

export type CreateEventTypeRequest = {
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

export type CreateSlotRequest = {
  startAt: DateTimeString
  durationMinutes: number
}

export type GuestContact = {
  name?: string
  email?: string
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

export type CreateBookingRequest = {
  eventTypeId: EventTypeId
  slotId: SlotId
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

export type ApiErrorPayload = {
  code: string
  message: string
  details?: unknown
}

export type ErrorResponse = ApiErrorPayload

export type EventTypeListResponse = EventType[]

export type EventTypeResponse = EventType

export type SlotListResponse = Slot[]

export type BookingCreatedResponse = Booking

export type BookingViewListResponse = BookingView[]

export type EventTypeCreatedResponse = EventType

export type SlotCreatedResponse = Slot
