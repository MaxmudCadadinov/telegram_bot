import { IsString, IsNumber } from 'class-validator';

export class CreateNestRegDto {

    @IsString()
    name: string;

    @IsString()
    phone: string;

    @IsNumber()
    telegram_id: number

}
