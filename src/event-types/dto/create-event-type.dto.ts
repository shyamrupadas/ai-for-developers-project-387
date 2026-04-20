import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator'

export class CreateEventTypeDto {
  @IsString()
  @IsNotEmpty()
  title!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsInt()
  @Min(1)
  durationMinutes!: number
}
