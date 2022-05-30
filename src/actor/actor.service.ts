import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { ActorModel } from './actor.model'
import { ActorDto } from './dto/actor.dto'

@Injectable()
export class ActorService {
  constructor(@InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>) {
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
        ]
      }
    }
    return this.ActorModel.find(options).select('-updatedAt -v').exec()
  }

  async bySlug(slug: string) {
    return this.ActorModel.findOne({slug}).exec()

  }

  async getActorById(_id: string) {
    const actor = await this.ActorModel.findById(_id)
    if (!actor) throw new NotFoundException('Actor not found')
    return actor
  }

  async create() {
    const defaultValue: ActorDto = {
      name: '',
      slug: '',
      photo: ''
    }
    const actor = await this.ActorModel.create(defaultValue)
    return actor._id
  }

  async update(_id: string, dto: ActorDto) {
   const updateDoc = await this.ActorModel.findByIdAndUpdate(_id, dto, {new: true})
    if (!updateDoc) throw new NotFoundException('Actor not found')
    return updateDoc
  }

  async delete(id: string) {
    const deleteDoc = await this.ActorModel.findByIdAndDelete(id)
    if (!deleteDoc) throw new NotFoundException('Actor not found')
    return deleteDoc
  }
}
