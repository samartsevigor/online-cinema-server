import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { UserModel } from './user.model'
import { UpdateUserDto } from './dto/update-user.dto'
import { genSalt, hash } from 'bcryptjs'
import { Types } from 'mongoose'

@Injectable()
export class UserService {
  constructor(@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>) {
  }

  async getUserById(_id: string) {
    const user = await this.UserModel.findById(_id)
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async updateProfile(_id: string, dto: UpdateUserDto) {
    const user = await this.getUserById(_id)
    const isSame = await this.UserModel.findOne({ email: dto.email })
    if (isSame && String(isSame._id) !== _id) throw new NotFoundException('Email is busy')

    if (dto.password) {
      const salt = await genSalt(10)
      user.password = await hash(dto.password, salt)
    }
    if (dto.isAdmin || dto.isAdmin === false) {
      user.isAdmin = dto.isAdmin
    }
    user.email = dto.email
    await user.save()
    return
  }

  async getUsersCount() {
    return this.UserModel.find().count().exec()
  }

  async deleteUser(id: string) {
    return this.UserModel.findByIdAndDelete(id).exec()
  }

  async getAllUsers(searchTerm?: string) {
    let options = {}
    if (searchTerm) {
      options = {
        "$or": [
          {
            email: new RegExp(searchTerm, 'i')
          }
        ]
      }
    }
    return this.UserModel.find(options).select('-password -updatedAt -v').exec()
  }

  async toggleFavorite(movieId: Types.ObjectId, user: UserModel) {
    const {_id, favorites} = user
    await this.UserModel.findByIdAndUpdate(_id, {
      favorites: favorites.includes(movieId) ? favorites.filter(item => item !== movieId) : [...favorites, movieId]
    })
  }

  async getFavoritesMovies(_id: Types.ObjectId) {
    return this.UserModel.findById(_id, 'favorites')
      .populate({
        path: 'favorites',
        populate: {
          path: 'genres'
        }
      })
      .exec()
      .then(data => data.favorites)
  }
}