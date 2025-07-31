import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';



export class AdminDto {

    @IsString()
    name: string;

    @IsString()
    password: string;



}