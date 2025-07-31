import path from 'path'
import axios from 'axios'
import fs from 'fs'
import dotenv from 'dotenv'
import { randomUUID } from 'crypto'

dotenv.config()

const TELEGRAM_BOT_TOKEN = process.env.telegram_token


export async function newName() {
    const number = Math.floor(1000000 + Math.random() * 9000000); // от 1000000 до 9999999
    return number.toString()
}

export async function downloads_photo(ctx) {
    console.log("photo сработал")

    //получаем file_id
    const photo = ctx.message.photo[ctx.message.photo.length - 1]
    const fileId = photo.file_id

    //получаем расширение файла
    const file = await ctx.api.getFile(fileId);
    const filePath = file.file_path;
    const extension = path.extname(filePath); // например, ".jpg"
    //получаем ссылку для скачивание
    const fileLink = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
    //создаем путь куда сохранить файл
    const uploadsDir = path.join(process.cwd(), 'uploads')
    //загружаем файл
    const response = await axios.get(fileLink, { responseType: 'stream' })
    const writer = fs.createWriteStream(path.join(uploadsDir, `${photo.file_unique_id}${extension}`));
    response.data.pipe(writer)

    await new Promise<void>((resolve, reject) => {
        writer.on('finish', () => resolve());
        writer.on('error', reject);
    });

    return `${photo.file_unique_id}${extension}`
}

export async function download_doc(ctx) {
    console.log('doc сработал')
    //получаем id документа
    const doc = ctx.message.document
    //console.log(doc)
    const doc_id = doc.file_id;
    // получаем расширение файла
    const file = await ctx.api.getFile(doc_id)
    const filePath = file.file_path

    //Получаем ссылку для скачивание
    const docLink = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`

    //Получаем путь куда сохранить фото
    const uploadsDir = path.join(process.cwd(), 'uploads')

    const response = await axios.get(docLink, { responseType: 'stream' })
    const writer = fs.createWriteStream(path.join(uploadsDir, `${doc.file_name}`));
    response.data.pipe(writer)

    await new Promise<void>((resolve, reject) => {
        writer.on('finish', () => resolve());
        writer.on('error', reject);
    });
    return `${doc.file_name}`

}

export async function download_voice(ctx) {
    console.log('voice сработал')

    const voice = ctx.message.voice
    const voice_id = voice.file_id
    const file = await ctx.api.getFile(voice_id)
    const filePath = file.file_path
    const extension = path.extname(filePath) || '.ogg'


    const voiceLink = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`

    const uploadsDir = path.join(process.cwd(), 'uploads')

    const response = await axios.get(voiceLink, { responseType: 'stream' })
    const writer = fs.createWriteStream(path.join(uploadsDir, `${voice.file_unique_id}${extension}`));
    response.data.pipe(writer)

    await new Promise<void>((resolve, reject) => {
        writer.on('finish', () => resolve());
        writer.on('error', reject);
    });
    return `${voice.file_unique_id}${extension}`
}

export async function download_video(ctx) {
    console.log("video сработал")
    //const video = ctx.message.video[ctx.message.video.length - 1]
    const video = ctx.message.video
    //console.log(video)
    const video_id = video.file_id
    const file = await ctx.api.getFile(video_id)
    //console.log('file:~~~~~~~~~~', file)
    const filePath = file.file_path
    const videoLink = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`

    const uploadsDir = path.join(process.cwd(), 'uploads')

    const response = await axios.get(videoLink, { responseType: 'stream' })
    const file_name_ext = `${randomUUID()}${path.extname(filePath)}`
    const writer = fs.createWriteStream(path.join(uploadsDir, file_name_ext));
    response.data.pipe(writer)

    await new Promise<void>((resolve, reject) => {
        writer.on('finish', () => resolve());
        writer.on('error', reject);
    });

    return file_name_ext
}

export async function download_audio(ctx) {
    console.log("audio сработал")
    const audio = ctx.message.audio
    //console.log('video', audio)
    const audio_id = audio.file_id
    //console.log('video_id', video_id)
    const file = await ctx.api.getFile(audio_id)
    //console.log('file', file)
    const filePath = file.file_path

    const audioLink = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`
    //console.log('videolink', videoLink)

    const uploadsDir = path.join(process.cwd(), 'uploads')
    //console.log('uploadsdir', uploadsDir)

    const response = await axios.get(audioLink, { responseType: 'stream' })
    const writer = fs.createWriteStream(path.join(uploadsDir, `${audio.file_name}`));
    response.data.pipe(writer)

    await new Promise<void>((resolve, reject) => {
        writer.on('finish', () => resolve());
        writer.on('error', reject);
    });

    return `${audio.file_name}`
}


