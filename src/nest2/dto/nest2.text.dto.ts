import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';



export class Textadmin {

    @IsNumber()
    @Type(() => Number)
    admin_id: number;

    @IsNumber()
    @Type(() => Number)
    user_id: number;

    @IsOptional()
    @IsString()
    text: string | null

    @IsOptional()
    @IsString()
    photos: string | null

    @IsOptional()
    @IsString()
    documents: string | null

    @IsOptional()
    @IsString()
    audio: string | null

    @IsOptional()
    @IsString()
    voice: string | null

    @IsOptional()
    @IsString()
    video: string | null

    @IsOptional()
    @IsString()
    caption: string | null

    @IsString()
    date: string

}