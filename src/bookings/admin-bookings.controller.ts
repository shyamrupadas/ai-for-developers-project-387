import { Controller, Get, Query } from '@nestjs/common'
import { BookingsService } from './bookings.service'

@Controller('admin/bookings')
export class AdminBookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Get()
  list(@Query('from') from?: string, @Query('to') to?: string) {
    return this.bookings.listAdmin(from, to)
  }
}
