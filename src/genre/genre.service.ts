import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { GenreModel } from './genre.model'
import { UpdateGenreDto } from './dto/update-genre.dto'
import { MovieService } from '../movie/movie.service'
import { ICollection } from './genre.interface'

@Injectable()
export class GenreService {
  constructor(@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>,
  private readonly movieService: MovieService
  ) {
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
    const genres = await this.getAll()
    const collections = await Promise.all(genres.map(async genre => {
      const moviesByGenre = await this.movieService.byGenres([genre._id])
      const result: ICollection = {
        _id: String(genre._id),
        image: moviesByGenre[0].bigPoster,
        slug: genre.slug,
        title: genre.name
      }
      return result
    }))
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
