import { IsBoolean, IsEmail, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @MinLength(6, {message: 'Password cannot be less then 6 characters'})
  @IsString()
  password?: string

  @ApiProperty()
  @IsBoolean()
  isAdmin?: boolean
}
