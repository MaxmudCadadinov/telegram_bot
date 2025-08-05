import { IsString, IsNumber, IsOptional, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';


enum FileType {
    AUDIO = 'audio',
    DOCUMENT = 'document',
    VIDEO = 'video',
    VOICE = 'voice',
    IMAGE = 'image'
}

class FileItemDto {
    @IsString()
    file_type: 'audio' | 'document' | 'video' | 'voice' | 'image';

    @IsString()
    file_url: string;
}

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
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FileItemDto)
    file: FileItemDto[];


    @IsString()
    date: string

}