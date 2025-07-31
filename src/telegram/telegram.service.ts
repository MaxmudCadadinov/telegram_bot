import { Injectable, OnModuleInit } from '@nestjs/common';
import { Bot } from 'grammy';
import { ConfigService } from '@nestjs/config';
import { new_keyboard } from 'src/buttons';
import { MyContext } from './telegram.context';
import { conversations, createConversation } from "@grammyjs/conversations"
import axios from 'axios'
import { downloads_photo, download_doc, download_voice, download_video, download_audio } from './downloads'
import { Sender } from 'src/nest1/entities/role.enum';
import { Chats } from '../nest1/entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { Users } from 'src/nest1/entities/nestUser.entity';
import { Role } from '../nest1/entities/role.enum'

@Injectable()
export class TelegramService implements OnModuleInit {
    public bot: Bot<MyContext>
    constructor(private readonly configService: ConfigService,
        @InjectRepository(Chats)
        private chatsRepo: Repository<Chats>,
        @InjectRepository(Users)
        private userRepo: Repository<Users>) { }

    onModuleInit() {

        const token = this.configService.get<string>('telegram_token')
        this.bot = new Bot<MyContext>(token!)

        this.bot.use(conversations())
        this.bot.use(createConversation(this.reg.bind(this)))

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

        await ctx.reply('Mavjud telefon raqamingizni yuboring')
        const { message: msg2 } = await conversation.waitFor("message:text")

        const telegram_id = Number(ctx.from?.id)
        const res = { name: msg1.text, phone: msg2.text, telegram_id: telegram_id }

        try {
            const response = await axios.post('http://localhost:3000/add_user', res, { headers: { "Content-Type": "application/json" } })
            if (response.data.message === true) { ctx.reply("Siz endi savol yozish imkoniyatiga ega bo'ldingiz. Savolingizni yuboring", { reply_markup: new_keyboard }) }
            else if (response.data.message === false) { await ctx.reply("Bunday foydalanuvchi ro'yhatdan o'tgan. Kirish tugmasini bosing", { reply_markup: new_keyboard }) }
        } catch (error) {
            ctx.reply("Serverda xatolik. Keyinchalik harakat qilib ko'ring", { reply_markup: new_keyboard })
        }
    }


    private async handleMessage(ctx: MyContext) {
        const telegram_id = Number(ctx.from!.id)
        const tg_id = { telegram_id: telegram_id }

        const response = await axios.post('http://localhost:3000/login', tg_id, { headers: { "Content-Type": "application/json" } })
        if (response.data.message === true) {

            const user = await this.userRepo.findOne({ where: { telegram_id: telegram_id, role: Role.USER } })
            //console.log(user!.id)
            if (!user) {
                console.error("❌ user is null");
                return
            }
            const admins = await this.userRepo.find({ where: { role: Role.ADMIN } })
            const msg = ctx.message

            const now = new Date();
            const formatted = now.toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });

            const body = {
                text: msg!.text ?? null,
                video: msg!.video ? await download_video(ctx) : null,
                audio: msg!.audio ? await download_audio(ctx) : null,
                document: msg!.document ? await download_doc(ctx) : null,
                voice: msg!.voice ? await download_voice(ctx) : null,
                photo: msg!.photo ? await downloads_photo(ctx) : null,
                caption: msg!.caption ?? null,
                sender: Sender.FROM_USER,
                user_id: user.id,
                created_at: formatted
            }
            for (let i of admins) {
                const b = { ...body, admin_id: i.id }
                const create = await this.chatsRepo.create(b)
                await this.chatsRepo.save(create)

            }


        } else if (response.data.message === false) { ctx.reply("Ro'yhatdan o'tish bosqichini amalga oshiring", { reply_markup: new_keyboard }) }


    }

}

