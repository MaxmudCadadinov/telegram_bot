import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Chats } from './chat.entity'


@Entity('files')

export class Files {
    @PrimaryGeneratedColumn()
    id: number

    // @Column()
    // user_id: number

    @Column()
    file: string

    @Column()
    file_type: 'video' | 'audio' | 'image' | 'voice' | 'document';

    @ManyToOne(() => Chats, chat => chat.files, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'chatId' })
    chat: Chats
}
