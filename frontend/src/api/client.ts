import type {
  BookingCreatedResponse,
  BookingViewListResponse,
  CreateBookingRequest,
  CreateEventTypeRequest,
  CreateSlotRequest,
  EventTypeCreatedResponse,
  EventTypeListResponse,
  EventTypeResponse,
  SlotCreatedResponse,
  SlotListResponse,
} from '../types/api'

export type ApiError = Error & {
  status?: number
  code?: string
  details?: unknown
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:4010'

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

async function parseJson(response: Response) {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

async function request<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers ?? {}),
    },
  })
  const data = await parseJson(response)
  if (!response.ok) {
    const error = new Error(
      data?.message ?? `Request failed with status ${response.status}`,
    ) as ApiError
    error.status = response.status
    error.code = data?.code ?? 'unknown_error'
    error.details = data?.details
    throw error
  }
  return data as T
}

function withQuery(
  path: string,
  params: Record<string, string | undefined>,
) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value)
  })
  const query = searchParams.toString()
  return query ? `${path}?${query}` : path
}

export const publicApi = {
  listEventTypes: () => request<EventTypeListResponse>('/event-types'),
  getEventType: (eventTypeId: string) =>
    request<EventTypeResponse>(`/event-types/${eventTypeId}`),
  listAvailableSlots: (
    eventTypeId: string,
    from?: string,
    to?: string,
  ) =>
    request<SlotListResponse>(
      withQuery(`/event-types/${eventTypeId}/slots`, { from, to }),
    ),
  createBooking: (payload: CreateBookingRequest) =>
    request<BookingCreatedResponse>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}

export const adminApi = {
  createEventType: (payload: CreateEventTypeRequest) =>
    request<EventTypeCreatedResponse>('/admin/event-types', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  createSlot: (payload: CreateSlotRequest) =>
    request<SlotCreatedResponse>('/admin/slots', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  listBookings: (from?: string, to?: string) =>
    request<BookingViewListResponse>(
      withQuery('/admin/bookings', { from, to }),
    ),
}
