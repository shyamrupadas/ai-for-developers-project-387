import { Body, Controller, Post } from '@nestjs/common'
import { CreateEventTypeDto } from './dto/create-event-type.dto'
import { EventTypesService } from './event-types.service'

@Controller('admin/event-types')
export class AdminEventTypesController {
  constructor(private readonly eventTypes: EventTypesService) {}

  @Post()
  create(@Body() body: CreateEventTypeDto) {
    return this.eventTypes.create(body)
  }
}
