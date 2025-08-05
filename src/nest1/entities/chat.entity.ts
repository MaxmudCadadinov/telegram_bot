import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Sender } from "./role.enum"
import { Files } from './file.entity'

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

    @Column({ nullable: true, type: "varchar" })
    media_group_id?: string

    @Column()
    admin_id: number

    @Column()
    user_id: number

    @Column({ type: 'text', nullable: true })
    text: string | null;

    @OneToMany(() => Files, file => file.chat, { cascade: true })
    files: Files[]

    @Column()
    created_at: string;

    @Column({ default: false })
    is_sent: boolean

}
