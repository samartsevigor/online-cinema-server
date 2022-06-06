import { Types } from 'mongoose'
import { IsNumber } from 'class-validator'

export class RatingDto {
  movieId: Types.ObjectId

  @IsNumber()
  value: number
}