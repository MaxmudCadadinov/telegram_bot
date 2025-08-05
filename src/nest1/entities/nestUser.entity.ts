import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Role } from './role.enum'

@Entity('user')
export class Users {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar' })
    user_name: string

    @Column({ type: 'varchar' })
    user_lastName: string

    @Column({ nullable: true })
    year: number

    @Column({ nullable: true, type: 'varchar' })
    phone: string | null

    @Column({ nullable: true, type: 'bigint', unsigned: true })
    telegram_id: number

    @Column({ nullable: true, type: 'varchar' })
    password: string | null

    @Column({
        type: 'enum',
        enum: Role,
        nullable: false
    })
    role: Role
}
