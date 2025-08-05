import { Injectable, OnModuleInit } from '@nestjs/common';
import { Bot } from 'grammy';
import { ConfigService } from '@nestjs/config';
import { new_keyboard } from 'src/buttons';
import { MyContext } from './telegram.context';
import { conversations, createConversation } from "@grammyjs/conversations"
import axios from 'axios'
//import { downloads_photo, download_doc, download_voice, download_video, download_audio } from './downloads'
import { with_msg_media_grop_id, msgg } from './msg'
import { Sender } from 'src/nest1/entities/role.enum';
import { Chats } from '../nest1/entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { Users } from 'src/nest1/entities/nestUser.entity';
import { Role } from '../nest1/entities/role.enum'
import { text } from 'stream/consumers';
import { Files } from 'src/nest1/entities/file.entity';



@Injectable()
export class TelegramService implements OnModuleInit {
    public bot: Bot<MyContext>
    constructor(private readonly configService: ConfigService,
        @InjectRepository(Chats)
        private chatsRepo: Repository<Chats>,
        @InjectRepository(Files)
        private fileRepo: Repository<Files>,
        @InjectRepository(Users)
        private userRepo: Repository<Users>) { }

    onModuleInit() {

        const token = this.configService.get<string>('telegram_token')
        this.bot = new Bot<MyContext>(token!)

        this.bot.use(conversations())
        this.bot.use(createConversation(this.reg))

        this.bot.command('start', (ctx) => {
            ctx.reply("Ro'yhatdan o'tmagan bo'lsangiz Ro'yhatdan o'tish tugmasini bosing yoki savolingizni qoldiring",
                { reply_markup: new_keyboard }
            );
        });


        this.bot.hears("Ro'yhatdan o'tish", (ctx) =>
            ctx.conversation.enter('reg')
        );

        this.bot.on('message', async (ctx) => {
            await this.handleMessage(ctx);
        });


        this.bot.start()
    }

    private async reg(conversation, ctx: MyContext) {
        await ctx.reply("Ro'yhatdan o'tish bosqichini boshladik")
        await ctx.reply("Ismingizni yuboring")
        const { message: msg1 } = await conversation.waitFor("message:text")

        await ctx.reply("Familiyanhizni yuboring")
        const { message: msg2 } = await conversation.waitFor("message:text")

        await ctx.reply("Yoshingizni yuboring")
        const { message: msg3 } = await conversation.waitFor("message:text")

        await ctx.reply('Mavjud telefon raqamingizni yuboring')
        const { message: msg4 } = await conversation.waitFor("message:text")

        const telegram_id = Number(ctx.from?.id)
        const res = { name: msg1.text, last_name: msg2.text, phone: msg4.text, year: Number(msg3.text), telegram_id: telegram_id }
        console.log(res)
        try {
            const response = await axios.post('http://localhost:3000/add_user', res, { headers: { "Content-Type": "application/json" } })
            console.log(response)
            if (response.data.message === true) { ctx.reply("Siz endi savol yozish imkoniyatiga ega bo'ldingiz. Savolingizni yuboring", { reply_markup: new_keyboard }) }
            else if (response.data.message === false) { await ctx.reply("Siz ro'yhatdan o'tgansiz. Savolingizni qoldiring", { reply_markup: new_keyboard }) }
        } catch (error) {
            ctx.reply("Serverda xatolik. Keyinchalik harakat qilib ko'ring", { reply_markup: new_keyboard })
        }
    }


    private async handleMessage(ctx: MyContext) {
        const telegram_id = Number(ctx.from!.id)
        const tg_id = { telegram_id: telegram_id }

        const response = await axios.post('http://localhost:3000/login', tg_id, { headers: { "Content-Type": "application/json" } })
        if (response.data.message === true) {

            const user = response.data.user_id

            const admins = await this.userRepo.find({ where: { role: Role.ADMIN } })
            const msg = ctx.message
            let files: Partial<Files>[] = []

            if (msg?.media_group_id) {
                files = await with_msg_media_grop_id(ctx, user)
            } else {
                files = await msgg(ctx, user)
            }

            //console.log(files)

            const now = new Date();
            const formatted = now.toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });


            let body: any = {
                text: msg!.text || msg!.caption || null,
                media_group_id: msg?.media_group_id || null,
                sender: Sender.FROM_USER,
                user_id: Number(user),
                created_at: formatted,
            }

            if (files.length > 0) {
                body.files = files
            }


            if (msg?.media_group_id) {

                const existingMsg = await this.chatsRepo.findOne({ where: { media_group_id: msg?.media_group_id }, relations: { files: true } })
                //console.log(existingMsg)
                if (existingMsg) {
                    const file = this.fileRepo.create(files[0])
                    existingMsg.files.push(file)
                    await this.chatsRepo.save(existingMsg)
                } else {
                    const b = { ...body, admin_id: 3 }

                    const create = await this.chatsRepo.create(b)
                    await this.chatsRepo.save(create)
                }
            } else {
                const b = { ...body, admin_id: 3 }

                const create = await this.chatsRepo.create(b)
                await this.chatsRepo.save(create)
            }

        } else if (response.data.message === false) { ctx.reply("Ro'yhatdan o'tish bosqichini amalga oshiring", { reply_markup: new_keyboard }) }
    }


}