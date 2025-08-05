import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';



export class LastSenderDto {

    @IsNumber()
    admin_id: number;

    @IsNumber()
    user_id: number;
}