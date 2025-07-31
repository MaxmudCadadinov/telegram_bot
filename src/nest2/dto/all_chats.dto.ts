import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';



export class All_chats {

    @IsNumber()
    @Type(() => Number)
    admin_id: number;

    @IsNumber()
    @Type(() => Number)
    user_id: number;



}