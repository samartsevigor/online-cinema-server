import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { MovieService } from './movie.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { MovieDto } from './dto/movie.dto'
import {Types} from 'mongoose'

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  async getMovies( @Query('searchTerm') searchTerm?: string) {
    return this.movieService.getAll(searchTerm)
  }

  @Get('by-id/:id')
  async byId( @Param('id') id: Types.ObjectId) {
    return this.movieService.byId(id)
  }

  @Get('by-slug/:slug')
  async bySlug( @Param('slug') slug: string) {
    return this.movieService.bySlug(slug)
  }

  @Get('by-actor/:actorId')
  async byActor( @Param('actorId') actorId: string) {
    return this.movieService.byActor(actorId)
  }

  @HttpCode(200)
  @Post('by-genres')
  async byGenres( @Body('genresIds') genresIds: Array<string>) {
    return this.movieService.byGenres(genresIds)
  }

  @Get('most-popular')
  async mostPopular() {
    return this.movieService.byMostPopular()
  }


  @Put('update-count-opened/:slug')
  async updateCountOpened( @Param('slug') slug: string) {
    return this.movieService.updateCountOpened(slug)
  }

  @Post()
  @Auth('admin')
  async create() {
    return this.movieService.create()
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @Auth('admin')
  async updateMovie(@Param('id') id: string, @Body() dto: MovieDto) {
    return this.movieService.update(id, dto)
  }

  @Delete(':id')
  @Auth('admin')
  async delete( @Param('id') id: string) {
    return this.movieService.delete(id)
  }

}
