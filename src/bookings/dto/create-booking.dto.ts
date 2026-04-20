import { Type } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator'
import { GuestContactDto } from './guest-contact.dto'

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  eventTypeId!: string

  @IsString()
  @IsNotEmpty()
  slotId!: string

  @IsOptional()
  @ValidateNested()
  @Type(() => GuestContactDto)
  guest?: GuestContactDto
}
