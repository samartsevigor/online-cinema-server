import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { MovieModel } from './movie.model'
import { MovieDto } from './dto/movie.dto'
import {Types} from 'mongoose'

@Injectable()
export class MovieService {

  constructor(@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>) {}


  async byId(_id: Types.ObjectId) {
    const doc = await this.MovieModel.findById({_id}).exec()
    if (!doc) throw new NotFoundException('Movie not found')
    return doc
  }

  async bySlug(slug: string) {
    const doc = await this.MovieModel.findOne({slug}).exec()
    if (!doc) throw new NotFoundException('Movie not found')
    return doc
  }

  async byActor(actorId: string) {
    const docs =  await this.MovieModel.find({actors: actorId}).exec()
    if (!docs) throw new NotFoundException('Movies not found')
    return docs
  }

  async byGenres(genres: Array<string>) {
    const docs =  await this.MovieModel.find({genres: {$in: genres}}).exec()
    if (!docs) throw new NotFoundException('Movies not found')
    return docs
  }

  async getAll(searchTerm?: string) {
    let options = {}
    if (searchTerm) {
      options = {
        "$or": [
          {
            title: new RegExp(searchTerm, 'i')
          }
        ]
      }
    }
    return this.MovieModel
      .find(options)
      .select('-updatedAt -v')
      .populate('genres actors')
      .populate({
        path: 'genres actors',
        select: '-updatedAt -v'
      })
      .exec()
  }

  async byMostPopular() {
    const docs = await this.MovieModel
      .find({countOpened: {$gt: 0}})
      .sort({countOpened: -1})
      .populate('genres')
    if (!docs) throw new NotFoundException('Movies not found')
    return docs
  }

  async updateCountOpened(slug: string) {
    const updateDoc = await this.MovieModel
      .findOneAndUpdate({slug}, {$inc: {countOpened: 1}}, {new: true})
    if (!updateDoc) throw new NotFoundException('Movies not found')
    return updateDoc
  }

  async create() {
    const defaultValue: MovieDto = {
      bigPoster: '',
      actors: [],
      genres: [],
      description: '',
      poster: '',
      title: '',
      videoUrl: '',
      slug: '',
    }
    const movie = await this.MovieModel.create(defaultValue)
    return movie._id
  }

  async update(_id: string, dto: MovieDto) {
    const updateDoc = await this.MovieModel.findByIdAndUpdate(_id, dto, {new: true})
    if (!updateDoc) throw new NotFoundException('Movie not found')
    return updateDoc
  }

  async delete(id: string) {
    const deleteDoc = await this.MovieModel.findByIdAndDelete(id)
    if (!deleteDoc) throw new NotFoundException('Movie not found')
    return deleteDoc
  }

}
