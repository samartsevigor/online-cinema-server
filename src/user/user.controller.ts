import { Body, Controller, Delete, Get, Param, Put, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { User } from './decorators/user.decorator'
import { UpdateUserDto } from './dto/update-user.dto'
import { Types } from 'mongoose'
import { UserModel } from './user.model'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @Auth('admin')
  async getUsers( @Query('searchTerm') searchTerm?: string) {
    return this.userService.getAllUsers(searchTerm)
  }

  @Get(':id')
  @Auth('admin')
  async getUser(@Param('id') id: string) {
    return this.userService.getUserById(id)
  }

  @Get('profile')
  @Auth('admin')
  async getProfile(@User('_id') _id: string) {
    return this.userService.getUserById(_id)
  }

  @Get('profile/favorites')
  @Auth()
  async getFavorites(@User('_id') _id: Types.ObjectId) {
    return this.userService.getFavoritesMovies(_id)
  }

  @Put('profile/favorites')
  @Auth()
  async toggleFavorites(@Body('movieId') movieId: Types.ObjectId,@User() user: UserModel) {
    return this.userService.toggleFavorite(movieId, user)
  }

  @Put('profile')
  @Auth()
  async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(_id, dto)
  }

  @Put(':id')
  @Auth('admin')
  async updateUser( @Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(id, dto)
  }

  @Delete(':id')
  @Auth('admin')
  async deleteUser( @Param('id') id: string) {
    return this.userService.deleteUser(id)
  }
}
