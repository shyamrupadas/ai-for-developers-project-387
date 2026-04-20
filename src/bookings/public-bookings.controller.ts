import { Body, Controller, Post } from '@nestjs/common'
import { CreateBookingDto } from './dto/create-booking.dto'
import { BookingsService } from './bookings.service'

@Controller('bookings')
export class PublicBookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Post()
  create(@Body() body: CreateBookingDto) {
    return this.bookings.create(body)
  }
}
