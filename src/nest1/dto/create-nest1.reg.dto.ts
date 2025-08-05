import { IsString, IsNumber } from 'class-validator';

export class CreateNestRegDto {

    @IsString()
    name: string;

    @IsString()
    last_name: string;

    @IsNumber()
    year: number;

    @IsString()
    phone: string;

    @IsNumber()
    telegram_id: number

}
