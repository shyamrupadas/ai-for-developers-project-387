import { IsISO8601, IsInt, Min } from 'class-validator'

export class CreateSlotDto {
  @IsISO8601()
  startAt!: string

  @IsInt()
  @Min(1)
  durationMinutes!: number
}
