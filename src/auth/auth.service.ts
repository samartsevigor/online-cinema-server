import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { hash, compare, genSalt } from 'bcryptjs'

import { UserModel } from '../user/user.model'
import { InjectModel } from 'nestjs-typegoose'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
  constructor(@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>) {
  }

  async register(dto: AuthDto) {
    const user = await this.UserModel.findOne({ email: dto.email })
    console.log(user)
    if (user) {
      throw new BadRequestException('Email already taken')
    }
    const salt = await genSalt(10)
    const newUser = new this.UserModel({
      email: dto.email,
      password: await hash(dto.password, salt)
    })
    return newUser.save()
  }

  async login(dto: AuthDto) {
    return this.validateUser(dto)
  }

  async validateUser(dto: AuthDto) {
    const user = await this.UserModel.findOne({ email: dto.email })
    if (!user){
      throw new UnauthorizedException('User not found')
    }
    const isValid = await compare(dto.password, user.password)
    if (!isValid) {
      throw new UnauthorizedException('Password incorrect')
    }
    return user
  }

}
