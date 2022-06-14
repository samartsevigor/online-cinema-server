import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { TypegooseModule } from 'nestjs-typegoose'
import { GenreModel } from './genre.model'
import { MovieModule } from '../movie/movie.module'

@Module({
  providers: [GenreService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: GenreModel,
        schemaOptions: {
          collection: 'genres'
        }
      }
    ]),
  MovieModule,
  ],
  controllers: [GenreController]
})
export class GenreModule {}
