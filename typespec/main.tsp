import "@typespec/http";
import "@typespec/rest";

using TypeSpec.Http;
using TypeSpec.Rest;

@service(#{ title: "Booking API" })
@server("http://127.0.0.1:4010", "Prism mock")
namespace BookingApi;

@doc("RFC 3339 date-time string with timezone offset (e.g. 2026-04-07T06:30:00Z or 2026-04-07T09:30:00+03:00).")
scalar DateTimeString extends string;

@doc("Opaque identifier (string).")
scalar Id extends string;

@doc("Event type id.")
scalar EventTypeId extends string;

@doc("Slot id.")
scalar SlotId extends string;

@doc("Booking id.")
scalar BookingId extends string;

@doc("Owner profile. In MVP there is exactly one predefined owner and no authentication.")
model Owner {
  id: Id;
  displayName: string;
}

@doc("Event type template that a guest selects when booking.")
model EventType {
  id: EventTypeId;
  title: string;
  description?: string;
  @doc("Duration of the meeting in minutes. Used to filter available slots for guests.")
  durationMinutes: int32;
}

@doc("Request payload to create an event type (admin only, no auth in MVP).")
model CreateEventTypeRequest {
  title: string;
  description?: string;
  durationMinutes: int32;
}

@doc("A time slot created by the owner via UI. Slots are not bound to event types; they are filtered by duration for a selected event type.")
model Slot {
  id: SlotId;
  startAt: DateTimeString;
  endAt: DateTimeString;
  @doc("Slot duration in minutes. Can be any positive integer (e.g. 15, 30, 45, 60).")
  durationMinutes: int32;
}

@doc("Request payload to create a slot (admin only, no auth in MVP). Business constraints: slot must be within owner availability 09:00-18:00 (owner/app time).")
model CreateSlotRequest {
  startAt: DateTimeString;
  durationMinutes: int32;
}

@doc("Guest contact info. Optional in MVP; may be extended later.")
model GuestContact {
  name?: string;
  email?: string;
}

@doc("Booking entity: a guest booked a given slot for a given event type.")
model Booking {
  id: BookingId;
  eventTypeId: EventTypeId;
  slotId: SlotId;
  startAt: DateTimeString;
  endAt: DateTimeString;
  createdAt: DateTimeString;
  guest?: GuestContact;
}

@doc("Create booking request. Constraints: slot must exist and its duration must equal eventType.durationMinutes. Booking interval must not overlap any existing booking interval, regardless of event type.")
model CreateBookingRequest {
  eventTypeId: EventTypeId;
  slotId: SlotId;
  guest?: GuestContact;
}

@doc("Event type summary embedded in admin booking list responses.")
model EventTypeSummary {
  id: EventTypeId;
  title: string;
  durationMinutes: int32;
}

@doc("Admin view of a booking, enriched with event type details.")
model BookingView {
  id: BookingId;
  startAt: DateTimeString;
  endAt: DateTimeString;
  createdAt: DateTimeString;
  slotId: SlotId;
  eventType: EventTypeSummary;
  guest?: GuestContact;
}

@doc("Machine-readable error payload.")
model ApiError {
  @doc("Stable error code, e.g. not_found, validation_error, booking_conflict.")
  code: string;
  message: string;
  @doc("Optional structured details (implementation-defined).")
  details?: unknown;
}

model ErrorResponse {
  @statusCode statusCode: 400 | 404 | 409 | 422;
  @body error: ApiError;
}

model EventTypeListResponse {
  @statusCode statusCode: 200;
  @body items: EventType[];
}

model EventTypeResponse {
  @statusCode statusCode: 200;
  @body item: EventType;
}

model SlotListResponse {
  @statusCode statusCode: 200;
  @body items: Slot[];
}

model BookingCreatedResponse {
  @statusCode statusCode: 201;
  @body item: Booking;
}

model BookingViewListResponse {
  @statusCode statusCode: 200;
  @body items: BookingView[];
}

model EventTypeCreatedResponse {
  @statusCode statusCode: 201;
  @body item: EventType;
}

model SlotCreatedResponse {
  @statusCode statusCode: 201;
  @body item: Slot;
}

@doc("Public endpoints for guests (no auth).")
namespace BookingApi.Public {
  @route("/event-types")
  interface EventTypes {
    @doc("List available event types.")
    @get op list(): EventTypeListResponse | ErrorResponse;

    @doc("Get a single event type.")
    @get op get(@path eventTypeId: EventTypeId): EventTypeResponse | ErrorResponse;

    @doc("List available (free) slots for a given event type. Returns only slots where slot.durationMinutes == eventType.durationMinutes and the slot interval does not overlap any existing booking. Optional query window can be used to limit results. Times are compared as instants.")
    @route("/{eventTypeId}/slots")
    @get op listAvailableSlots(
      @path eventTypeId: EventTypeId,
      @query from?: DateTimeString,
      @query to?: DateTimeString
    ): SlotListResponse | ErrorResponse;
  }

  @route("/bookings")
  interface Bookings {
    @doc("Create a booking for the selected event type and slot. 409 is returned when booking interval overlaps an existing booking (any event type).")
    @post op create(@body body: CreateBookingRequest): BookingCreatedResponse | ErrorResponse;
  }
}

@doc("Admin endpoints for the owner UI (no auth in MVP).")
namespace BookingApi.Admin {
  @route("/admin/event-types")
  interface EventTypes {
    @doc("Create an event type.")
    @post op create(@body body: CreateEventTypeRequest): EventTypeCreatedResponse | ErrorResponse;
  }

  @route("/admin/slots")
  interface Slots {
    @doc("Create a slot within availability window 09:00-18:00 (owner/app time).")
    @post op create(@body body: CreateSlotRequest): SlotCreatedResponse | ErrorResponse;
  }

  @route("/admin/bookings")
  interface Bookings {
    @doc("List upcoming bookings across all event types. Query window can be used to filter by startAt. If omitted, server returns future bookings from 'now'.")
    @get op list(
      @query from?: DateTimeString,
      @query to?: DateTimeString
    ): BookingViewListResponse | ErrorResponse;
  }
}
