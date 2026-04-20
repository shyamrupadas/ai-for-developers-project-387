import { Module } from '@nestjs/common'
import { AdminBookingsController } from './bookings/admin-bookings.controller'
import { BookingsService } from './bookings/bookings.service'
import { PublicBookingsController } from './bookings/public-bookings.controller'
import { AdminEventTypesController } from './event-types/admin-event-types.controller'
import { EventTypesService } from './event-types/event-types.service'
import { PublicEventTypesController } from './event-types/public-event-types.controller'
import { AdminSlotsController } from './slots/admin-slots.controller'
import { PublicSlotsController } from './slots/public-slots.controller'
import { SlotsService } from './slots/slots.service'
import { StoreService } from './storage/store.service'

@Module({
  controllers: [
    PublicEventTypesController,
    AdminEventTypesController,
    PublicSlotsController,
    AdminSlotsController,
    PublicBookingsController,
    AdminBookingsController,
  ],
  providers: [StoreService, EventTypesService, SlotsService, BookingsService],
})
export class AppModule {}
