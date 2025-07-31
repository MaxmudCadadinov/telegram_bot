import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Sender } from "./role.enum"

@Entity('chats')

export class Chats {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'enum',
        enum: Sender,
        nullable: false
    })
    sender: Sender

    @Column()
    admin_id: number

    @Column()
    user_id: number

    @Column({ type: 'text', nullable: true })
    text: string | null;

    @Column({ type: 'varchar', nullable: true })
    photos: any | null 

    @Column({ type: 'varchar', nullable: true })
    documents: any | null

    @Column({ type: 'varchar', nullable: true })
    audio: any | null

    @Column({ type: 'varchar', nullable: true })
    voice: any | null

    @Column({ type: 'varchar', nullable: true })
    video: any | null

    @Column({ type: 'varchar', nullable: true })
    caption: any | null

    @Column()
    created_at: string;

    @Column({ default: false })
    is_sent: boolean

}
