import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';



export class LoginDto {

    @IsNumber()
    @Type(() => Number)
    telegram_id: number;

}
