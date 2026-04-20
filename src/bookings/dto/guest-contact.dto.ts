import { IsEmail, IsOptional, IsString } from 'class-validator'

export class GuestContactDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsEmail()
  email?: string
}
