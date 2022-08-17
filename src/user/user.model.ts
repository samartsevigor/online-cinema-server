import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses'
import { prop, Ref } from '@typegoose/typegoose'
import { MovieModel } from '../movie/movie.model'

export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
  @prop({ default: '' })
  name: string
  @prop({ default: '' })
  surname: boolean
  @prop({ default: '' })
  linkedIn: boolean
  @prop({unique: true})
  email: string
  @prop()
  password: string
  @prop({default: false})
  isAdmin: boolean
  @prop({default: [], ref: () => MovieModel})
  favorites?: Ref<MovieModel>[]
}
