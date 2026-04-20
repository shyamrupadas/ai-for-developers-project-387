import { Body, Controller, Post } from '@nestjs/common'
import { CreateSlotDto } from './dto/create-slot.dto'
import { SlotsService } from './slots.service'

@Controller('admin/slots')
export class AdminSlotsController {
  constructor(private readonly slots: SlotsService) {}

  @Post()
  create(@Body() body: CreateSlotDto) {
    return this.slots.create(body)
  }
}
