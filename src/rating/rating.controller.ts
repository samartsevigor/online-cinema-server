import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { RatingService } from './rating.service'
import { Types } from 'mongoose'
import { Auth } from '../auth/decorators/auth.decorator'
import { User } from '../user/decorators/user.decorator'
import { RatingDto } from './dto/rating.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Ratting')
@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get(':movieId')
  @Auth()
  async getMovieValueByUser( @Param('movieId') movieId: Types.ObjectId, @User('_id') _id: Types.ObjectId) {
    return this.ratingService.getMovieValueByUser(movieId, _id)
  }

  @Post('set-rating')
  @Auth()
  async setRating(  @User('_id') _id: Types.ObjectId,@Body() dto: RatingDto) {
    return this.ratingService.setRating(_id, dto)
  }
}
