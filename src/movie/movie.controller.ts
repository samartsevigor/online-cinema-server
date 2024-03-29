import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query, Req,Headers,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { MovieService } from './movie.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { MovieDto } from './dto/movie.dto'
import {Types} from 'mongoose'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ApiOperation({
    summary: 'Get all movies',
  })
  @Get()
  async getMovies( @Headers() headers: Headers, @Query('searchTerm') searchTerm?: string) {
    console.log(headers, 333)
    return this.movieService.getAll(searchTerm)
  }

  @ApiOperation({
    summary: 'Get movie by id',
  })
  @Get('by-id/:id')
  async byId( @Param('id') id: Types.ObjectId) {
    return this.movieService.byId(id)
  }

  @ApiOperation({
    summary: 'Get movie by slug',
  })
  @Get('by-slug/:slug')
  async bySlug( @Param('slug') slug: string) {
    return this.movieService.bySlug(slug)
  }

  @ApiOperation({
    summary: 'Get movies by actor',
  })
  @Get('by-actor/:actorId')
  async byActor( @Param('actorId') actorId: string) {
    return this.movieService.byActor(actorId)
  }

  @ApiOperation({
    summary: 'Get movies by genre',
  })
  @HttpCode(200)
  @Post('by-genres')
  async byGenres( @Body('genresIds') genresIds: Array<Types.ObjectId>) {
    return this.movieService.byGenres(genresIds)
  }

  @ApiOperation({
    summary: 'Get most popular movies',
  })
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
