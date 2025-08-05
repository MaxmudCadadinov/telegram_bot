import { downloads_photo, download_doc, download_voice, download_video, download_audio } from './downloads'

export async function with_msg_media_grop_id(ctx, user) {
    const msg = ctx.message

    const files: { user_id: number, file: string; file_type: any }[] = []


    if (msg!.video) {
        files.push({
            user_id: user,
            file: await download_video(ctx),
            file_type: 'video',
        })

    }


    if (msg!.photo && msg!.photo.length > 0) {
        const biggestPhoto = msg!.photo[msg!.photo.length - 1]
        files.push({
            user_id: user,
            file: await downloads_photo(ctx),
            file_type: 'image',

        })
    }

    if (msg!.audio) {
        files.push({
            user_id: user,
            file: await download_audio(ctx),
            file_type: 'audio',
        })

    }
    if (msg!.document) {
        files.push({
            user_id: user,
            file: await download_doc(ctx),
            file_type: 'document',
        })

    }

    if (msg!.voice) {
        files.push({
            user_id: user,
            file: await download_voice(ctx),
            file_type: 'voice',
        })

    }
    return files
}

export async function msgg(ctx, user) {
    const files: { user_id: number, file: string; file_type: any }[] = []

    const msg = ctx.message

    if (msg!.video) {
        files.push({
            user_id: user,
            file: await download_video(ctx),
            file_type: 'video',
        })

    }


    if (msg!.photo && msg!.photo.length > 0) {
        const biggestPhoto = msg!.photo[msg!.photo.length - 1]
        files.push({
            user_id: user,
            file: await downloads_photo(ctx),
            file_type: 'image',

        })
    }

    if (msg!.audio) {
        files.push({
            user_id: user,
            file: await download_audio(ctx),
            file_type: 'audio',
        })

    }
    if (msg!.document) {
        files.push({
            user_id: user,
            file: await download_doc(ctx),
            file_type: 'document',
        })

    }

    if (msg!.voice) {
        files.push({
            user_id: user,
            file: await download_voice(ctx),
            file_type: 'voice',
        })

    }
    return files
}