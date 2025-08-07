import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm';
import { Textadmin } from './dto/nest2.text.dto';
import { Chats } from 'src/nest1/entities/chat.entity';
import { Users } from 'src/nest1/entities/nestUser.entity';
import { All_chats } from './dto/all_chats.dto';
import { download_file } from './downloadfiles'
import { AdminDto } from './dto/login_admin.dto';
import { Role, Sender } from '../nest1/entities/role.enum'
import { TelegramService } from 'src/telegram/telegram.service';
import { InputFile } from 'grammy'
import { JwtService } from '@nestjs/jwt'
import { Files } from 'src/nest1/entities/file.entity';
import { LastSenderDto } from './dto/last_message.dto';
import path from 'path';
import { createReadStream } from "fs";


@Injectable()
export class Nest2Service {
  constructor(
    @InjectRepository(Chats)
    private chatsRepo: Repository<Chats>,
    @InjectRepository(Users)
    private userRepo: Repository<Users>,
    private readonly configService: ConfigService,
    private readonly telegramService: TelegramService,
    private jwtService: JwtService) { }


  private async checkAndSendMessages(user_id, admin_id) {
    const admin_name = await this.userRepo.findOne({ where: { id: admin_id, role: Role.ADMIN } })
    const unsent = await this.chatsRepo.find({ where: { is_sent: false, sender: Sender.FROM_ADMIN, user_id: user_id }, relations: ['files'] })
    const user = await this.userRepo.findOne({ where: { id: user_id, role: Role.USER } })
    //console.log(unsent)

    for (const chat of unsent) {

      if (chat.text) {
        await this.telegramService.bot.api.sendMessage(user!.telegram_id, chat.text)
      }
      else if (chat.files && chat.files.length > 0) {
        for (let i of chat.files) {
          if (i.file_type === 'video') {
            const uploadsDir = path.join(process.cwd(), 'uploads')
            const filePath = path.join(uploadsDir, i.file);

            const inputfile = new InputFile(createReadStream(`${filePath}`))
            this.telegramService.bot.api.sendVideo(user!.telegram_id, inputfile)
          } else if (i.file_type === 'audio') {
            const uploadsDir = path.join(process.cwd(), 'uploads')
            const filePath = path.join(uploadsDir, i.file);

            const inputfile = new InputFile(createReadStream(`${filePath}`))
            this.telegramService.bot.api.sendAudio(user!.telegram_id, inputfile)
          } else if (i.file_type === 'voice') {
            const uploadsDir = path.join(process.cwd(), 'uploads')
            const filePath = path.join(uploadsDir, i.file);

            const inputfile = new InputFile(createReadStream(`${filePath}`))
            this.telegramService.bot.api.sendVoice(user!.telegram_id, inputfile)
          } else if (i.file_type === 'document') {
            const uploadsDir = path.join(process.cwd(), 'uploads')
            const filePath = path.join(uploadsDir, i.file);

            const inputfile = new InputFile(createReadStream(`${filePath}`))
            this.telegramService.bot.api.sendDocument(user!.telegram_id, inputfile)
          } else if (i.file_type === 'image') {
            const uploadsDir = path.join(process.cwd(), 'uploads')
            const filePath = path.join(uploadsDir, i.file);

            const inputfile = new InputFile(createReadStream(`${filePath}`))
            this.telegramService.bot.api.sendPhoto(user!.telegram_id, inputfile)
          }
        }
      }
      chat.is_sent = true
      await this.chatsRepo.save(chat)
    }

  }
  async text_from_admin(dto: Textadmin) {
    const body = {
      admin_id: dto.admin_id, user_id: dto.user_id, text: dto.text, file: dto.file, created_at: dto.date
    }
    console.log('body~~~~~~~~', body.file)

    let files: Partial<Files>[] = []
    // console.log(files)

    if (body.file && body.file.length) {
      console.log('body обнаружен')
      for (let i of body.file) {
        const local_name = await download_file(i.file_url)
        files.push({ 'file': local_name, "file_type": i.file_type })
      }
      console.log('files~~~~~~~~~~', files)
    }
    const admin_id = body.admin_id
    const user_id = body.user_id
    const text = body.text ?? null
    const created_at = body.created_at


    let finish_obj: any = { text: text, admin_id: admin_id, user_id: user_id, created_at: created_at }

    if (files.length > 0) {
      console.log('~~~~~~~~~~', files.length)
      finish_obj.files = files
    }
    console.log('finish obj~~~~~~~~~~', finish_obj) 

    const create = await this.chatsRepo.create(finish_obj)
    //console.log("create сработал")
    await this.chatsRepo.save(create)
    //console.log('save сработал')
    await this.checkAndSendMessages(finish_obj.user_id, body.admin_id)
  }

  async all_chats(dto: All_chats) {

    const fileBaseUrl = 'http://localhost:3000/uploads/';

    const obj: any[] = []

    const select_chats = await this.chatsRepo.find({ where: { user_id: dto.user_id, admin_id: dto.admin_id }, relations: ['files'] })


    const result = select_chats.map(chat => {
      return {
        admin_id: chat.admin_id,
        user_id: chat.user_id,
        text: chat.text ?? null,
        created_at: chat.created_at,
        sender: chat.sender,


        files: chat.files.map(file => ({
          file: `${fileBaseUrl}${file.file}`,
          file_type: file.file_type
        }))
      };
    });


    return result;
  }

  async add_admin(dto: AdminDto) {
    const admin_save = { user_name: dto.name, password: dto.password, role: Role.ADMIN }

    const obj = await this.userRepo.create(admin_save)
    await this.userRepo.save(obj)
  }

  async login_admin(dto: AdminDto) {
    const user = await this.userRepo.findOne({ where: { role: Role.ADMIN, user_name: dto.name, password: dto.password } })
    if (user) {
      const payload = { admin_id: user.id, sub: user.user_name, role: user.role }
      const token = this.jwtService.sign(payload)
      return { token: token }
    } else { return "not admin" }

  }

  async all_users() {
    const all_users = this.userRepo.find({ where: { role: Role.USER }, select: ['id', 'user_name', 'phone', 'year', 'user_lastName'] })
    return all_users
  }

  async last_message(dto: LastSenderDto) {
    const file_url = 'https://efc471461115.ngrok-free.app/uploads/'
    const last_message = await this.chatsRepo.find({
      where: { sender: Sender.FROM_USER, is_sent: false, admin_id: dto.admin_id, user_id: dto.user_id },
      order: { created_at: 'ASC' },
      relations: ['files'],
    })
    for (let i of last_message) {
      if (i.files && i.files.length > 0) {
        for (let file of i.files) {
          file.file = `${file_url}${file.file}`
        }
      }
      //i.is_sent = true
    }
    await this.chatsRepo.save(last_message)
    return last_message
  }

}


