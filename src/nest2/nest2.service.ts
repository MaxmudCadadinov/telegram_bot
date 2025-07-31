import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm';
import { Textadmin } from './dto/nest2.text.dto';
import { Chats } from 'src/nest1/entities/chat.entity';
import { Users } from 'src/nest1/entities/nestUser.entity';
import { All_chats } from './dto/all_chats.dto';
import { download_file } from './downloadfiles'
import { AdminDto } from './dto/add_admin.dto';
import { Role, Sender } from '../nest1/entities/role.enum'
import { TelegramService } from 'src/telegram/telegram.service';
import { InputFile } from 'grammy'
import { JwtService } from '@nestjs/jwt'



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


  private async checkAndSendMessages(id) {
    const unsent = await this.chatsRepo.find({ where: { is_sent: false, sender: Sender.FROM_ADMIN, user_id: id } })

    for (const message of unsent) {
      const user = await this.userRepo.findOne({ where: { id: message.user_id } })
      if (!user || !user.telegram_id) continue

      const chatId = user.telegram_id

      try {
        if (message.text) await this.telegramService.bot.api.sendMessage(chatId, message.text)
        if (message.caption) await this.telegramService.bot.api.sendMessage(chatId, message.caption)
        if (message.photos) await this.telegramService.bot.api.sendPhoto(chatId, new InputFile(`uploads/${message.photos}`))
        if (message.documents) await this.telegramService.bot.api.sendDocument(chatId, new InputFile(`uploads/${message.documents}`))
        if (message.voice) await this.telegramService.bot.api.sendVoice(chatId, new InputFile(`uploads/${message.voice}`))
        if (message.audio) await this.telegramService.bot.api.sendAudio(chatId, new InputFile(`uploads/${message.audio}`))
        if (message.video) await this.telegramService.bot.api.sendVideo(chatId, new InputFile(`uploads/${message.video}`))

        message.is_sent = true
        await this.chatsRepo.save(message)
      } catch (err) {
        console.error(`❌ Xatolik: ${err.message}`)
      }
    }
  }

  async text_from_admin(dto: Textadmin) {
    const body = {
      admin_id: dto.admin_id, user_id: dto.user_id, text: dto.text, photos: dto.photos, documents: dto.documents,
      audio: dto.audio, voice: dto.voice, video: dto.video, caption: dto.caption, created_at: dto.date
    }
    const admin_id = body.admin_id
    const user_id = body.user_id
    const text = body.text ?? null
    const name_photo = body.photos ? await download_file(body.photos) : null
    const name_doc = body.documents ? await download_file(body.documents) : null
    const voice_name = body.voice ? await download_file(body.voice) : null
    const video_name = body.video ? await download_file(body.video) : null
    const audio_name = body.audio ? await download_file(body.audio) : null
    const caption = body.caption ?? null
    const created_at = body.created_at

    const finish_obj = {
      text: text, admin_id: admin_id, user_id: user_id, photos: name_photo, documents: name_doc, voice: voice_name,
      video: video_name, audio: audio_name, caption: caption, created_at: created_at
    }
    const create = await this.chatsRepo.create(finish_obj)
    await this.chatsRepo.save(create)
    await this.checkAndSendMessages(finish_obj.user_id)
  }

  async all_chats(dto: All_chats) {

    const fileBaseUrl = 'https://d13409b2d57d.ngrok-free.app/uploads/';

    const obj: any[] = []

    const select_chats = await this.chatsRepo.find({ where: { user_id: dto.user_id, admin_id: dto.admin_id } })
    //console.log(select_chats)
    for (let i of select_chats) {
      //console.log(i)
      const chatobj = {
        id: i.id,
        admin_id: i.admin_id,
        user_id: i.user_id,
        text: i.text ? i.text : null,
        photos: i.photos ? fileBaseUrl + i.photos : null,
        documents: i.documents ? fileBaseUrl + i.documents : null,
        audio: i.audio ? fileBaseUrl + i.audio : null,
        voice: i.voice ? fileBaseUrl + i.voice : null,
        video: i.video ? fileBaseUrl + i.video : null,
        caption: i.caption ? i.caption : null,
        created_at: i.created_at,
        sender: i.sender
      }
      obj.push(chatobj)
    }

    //console.log(obj)
    return obj
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
    const all_users = this.userRepo.find({ where: { role: Role.USER }, select: ['id', 'user_name', 'phone'] })
    return all_users
  }




}


