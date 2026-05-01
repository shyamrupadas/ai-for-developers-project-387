import { Injectable } from "@nestjs/common";
import {
  computeEndAt,
  ensureValidDateRange,
  ensureWithinWorkingHours,
  intervalsOverlap,
  parseOptionalDateTime,
  parseDateTime,
} from "../common/datetime";
import { notFoundError, validationError } from "../common/api-errors";
import { Slot } from "../domain/models";
import { StoreService } from "../storage/store.service";

@Injectable()
export class SlotsService {
  constructor(private readonly store: StoreService) {}

  create(data: { startAt: string; durationMinutes: number }): Slot {
    const start = parseDateTime(data.startAt, "startAt");
    if (data.durationMinutes <= 0) {
      throw validationError("Duration must be greater than zero", {
        field: "durationMinutes",
      });
    }

    const end = computeEndAt(start, data.durationMinutes);
    ensureWithinWorkingHours(start, end, {
      startAt: data.startAt,
      durationMinutes: data.durationMinutes,
    });

    return this.store.createSlot({
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      durationMinutes: data.durationMinutes,
    });
  }

  listAvailable(eventTypeId: string, from?: string, to?: string): Slot[] {
    const eventType = this.store.getEventType(eventTypeId);
    if (!eventType) {
      throw notFoundError("Event type not found", { eventTypeId });
    }

    const fromDate = parseOptionalDateTime(from, "from");
    const toDate = parseOptionalDateTime(to, "to");
    ensureValidDateRange(fromDate, toDate, { from, to });

    const bookings = this.store.listBookings();
    const allSlots = this.store.listSlots();
    const durationMatchedSlots = allSlots.filter(
      (slot) => slot.durationMinutes === eventType.durationMinutes,
    );
    const rangeMatchedSlots = durationMatchedSlots.filter((slot) => {
      const slotStart = new Date(slot.startAt);
      if (fromDate && slotStart.getTime() < fromDate.getTime()) return false;
      if (toDate && slotStart.getTime() > toDate.getTime()) return false;
      return true;
    });
    const availableSlots = rangeMatchedSlots.filter((slot) => {
      const slotStart = new Date(slot.startAt).getTime();
      const slotEnd = new Date(slot.endAt).getTime();
      const hasConflict = bookings.some((booking) => {
        const bookingStart = new Date(booking.startAt).getTime();
        const bookingEnd = new Date(booking.endAt).getTime();
        return intervalsOverlap(slotStart, slotEnd, bookingStart, bookingEnd);
      });
      return !hasConflict;
    });

    return availableSlots.sort((a, b) => a.startAt.localeCompare(b.startAt));
  }
}
