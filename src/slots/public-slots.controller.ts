import { Controller, Get, Param, Query } from '@nestjs/common'
import { SlotsService } from './slots.service'

@Controller('event-types/:eventTypeId/slots')
export class PublicSlotsController {
  constructor(private readonly slots: SlotsService) {}

  @Get()
  listAvailable(
    @Param('eventTypeId') eventTypeId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.slots.listAvailable(eventTypeId, from, to)
  }
}
