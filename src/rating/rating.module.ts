import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { TypegooseModule } from 'nestjs-typegoose'
import { RatingModel } from './rating.model'
import { MovieModel } from '../movie/movie.model'

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: RatingModel,
        schemaOptions: {
          collection: 'ratings'
        }
      }
    ]),
  MovieModel
  ],
  controllers: [RatingController],
  providers: [RatingService]
})
export class RatingModule {}
