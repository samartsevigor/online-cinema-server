import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { UpdateUserDto } from '../user/dto/update-user.dto'
import { genSalt, hash } from 'bcryptjs'
import { GenreModel } from './genre.model'
import { UpdateGenreDto } from './dto/update-genre.dto'

@Injectable()
export class GenreService {
  constructor(@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>) {
  }

  async getAll(searchTerm?: string) {
    let options = {}
    if (searchTerm) {
      options = {
        "$or": [
          {
            name: new RegExp(searchTerm, 'i')
          },
          {
            slug: new RegExp(searchTerm, 'i')
          },
          {
            description: new RegExp(searchTerm, 'i')
          }
        ]
      }
    }
    return this.GenreModel.find(options).select('-updatedAt -v').exec()
  }

  async bySlug(slug: string) {
    return this.GenreModel.findOne({slug}).exec()

  }

  async getGenreById(_id: string) {
    const genre = await this.GenreModel.findById(_id)
    if (!genre) throw new NotFoundException('Genre not found')
    return genre
  }

  async create() {
    const defaultValue: UpdateGenreDto = {
      name: '',
      slug: '',
      description: '',
      icon: ''
    }
    const genre = await this.GenreModel.create(defaultValue)
    return genre._id
  }

  async getCollections() {
    const genres = this.getAll()
    const collections = genres
    // Todo Make collections
    return collections
  }

  async update(_id: string, dto: UpdateGenreDto) {
   const updateDoc = await this.GenreModel.findByIdAndUpdate(_id, dto, {new: true})
    if (!updateDoc) throw new NotFoundException('Genre not found')
    return updateDoc
  }

  async delete(id: string) {
    const deleteDoc = await this.GenreModel.findByIdAndDelete(id)
    if (!deleteDoc) throw new NotFoundException('Genre not found')
    return deleteDoc
  }
}
