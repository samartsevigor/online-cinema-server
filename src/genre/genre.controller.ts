import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { GenreService } from './genre.service'
import { UpdateGenreDto } from './dto/update-genre.dto'
import { ApiQuery, ApiTags } from '@nestjs/swagger'

@ApiTags('Genres')
@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  @ApiQuery({name: 'searchTerm', required: false})
  async getGenres( @Query('searchTerm') searchTerm?: string) {
    return this.genreService.getAll(searchTerm)
  }

  @Get('collections')
  async getCollections() {
    return this.genreService.getCollections()
  }

  @Get('by-slug/:slug')
  async bySlug( @Param('slug') slug: string) {
    return this.genreService.bySlug(slug)
  }

  @Get(':id')
  @Auth('admin')
  async getUser(@Param('id') id: string) {
    return this.genreService.getGenreById(id)
  }

  @Post()
  @Auth('admin')
  async create() {
    return this.genreService.create()
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @Auth('admin')
  async updateProfile(@Param('id') id: string, @Body() dto: UpdateGenreDto) {
    return this.genreService.update(id, dto)
  }

  @Delete(':id')
  @Auth('admin')
  async delete( @Param('id') id: string) {
    return this.genreService.delete(id)
  }
}
