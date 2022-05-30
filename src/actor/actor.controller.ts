import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { ActorService } from './actor.service'
import { ActorDto } from './dto/actor.dto'

@Controller('actors')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Get()
  async getActors( @Query('searchTerm') searchTerm?: string) {
    return this.actorService.getAll(searchTerm)
  }

  @Get('by-slug/:slug')
  async bySlug( @Param('slug') slug: string) {
    return this.actorService.bySlug(slug)
  }

  @Get(':id')
  @Auth('admin')
  async getUser(@Param('id') id: string) {
    return this.actorService.getActorById(id)
  }

  @Post()
  @Auth('admin')
  async create() {
    return this.actorService.create()
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @Auth('admin')
  async updateProfile(@Param('id') id: string, @Body() dto: ActorDto) {
    return this.actorService.update(id, dto)
  }

  @Delete(':id')
  @Auth('admin')
  async delete( @Param('id') id: string) {
    return this.actorService.delete(id)
  }
}
