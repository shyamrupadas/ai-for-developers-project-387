import { Controller, Get, Param } from '@nestjs/common'
import { EventTypesService } from './event-types.service'

@Controller('event-types')
export class PublicEventTypesController {
  constructor(private readonly eventTypes: EventTypesService) {}

  @Get()
  list() {
    return this.eventTypes.list()
  }

  @Get(':eventTypeId')
  get(@Param('eventTypeId') eventTypeId: string) {
    return this.eventTypes.getById(eventTypeId)
  }
}
