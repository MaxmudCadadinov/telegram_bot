import { Injectable } from '@nestjs/common';
import { CreateNestRegDto } from './dto/create-nest1.reg.dto';
import { LoginDto } from './dto/create_nest1.login.dto'
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config'
import { Users } from './entities/nestUser.entity'
import { Repository } from 'typeorm';
import { Role, Sender } from './entities/role.enum'


@Injectable()
export class Nest1Service {
  constructor(
    @InjectRepository(Users)
    private usersRepo: Repository<Users>,
    private readonly configService: ConfigService) { }

  async add_user(dto: CreateNestRegDto) {
    const existing_user = await this.usersRepo.findOne({ where: { telegram_id: dto.telegram_id } })
    if (existing_user) { return { message: false } }
    else {
      const user_to_save = { user_name: dto.name, phone: dto.phone, telegram_id: dto.telegram_id, role: Role.USER }
      const new_user = await this.usersRepo.create(user_to_save)
      await this.usersRepo.save(new_user)
      return { message: true }
    }
  }

  async login(dto: LoginDto) {
    const existing_user = await this.usersRepo.findOne({ where: { telegram_id: dto.telegram_id } })
    //console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~', existing_user)
    if (existing_user) {
      return { message: true, name: existing_user.user_name }
    } else {
      return { message: false, name: false }
    }
  }
  //Получаем и сохраняем текст пользователья в базу данных 


}

