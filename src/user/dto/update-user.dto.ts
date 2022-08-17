import { IsBoolean, IsEmail, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiProperty()
  @IsEmail()
  name: string

  @ApiProperty()
  @IsEmail()
  surname: string

  @ApiProperty()
  @IsEmail()
  linkedIn: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @MinLength(6, { message: 'Password cannot be less then 6 characters' })
  @IsString()
  password?: string

  @ApiProperty()
  @IsBoolean()
  isAdmin?: boolean
}
