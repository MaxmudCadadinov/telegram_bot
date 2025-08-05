import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { Nest2Service } from './nest2.service';
import { Textadmin } from './dto/nest2.text.dto';
import { All_chats } from './dto/all_chats.dto';
import { AdminDto } from './dto/login_admin.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { LastSenderDto } from './dto/last_message.dto';



@Controller()
export class Nest2Controller {
    constructor(private readonly nest2Service: Nest2Service) { }


    //@UseGuards(JwtAuthGuard)
    @Post('/text_from_admin')
    async add_user(@Body() dto: Textadmin) {

        return await this.nest2Service.text_from_admin(dto)
    }
    //@UseGuards(JwtAuthGuard)
    @Post('/all_chats')
    async all_chats(@Body() dto: All_chats) {

        return await this.nest2Service.all_chats(dto)
    }

    @Post('/add_admin')
    async add_admin(@Body() dto: AdminDto) {
        return await this.nest2Service.add_admin(dto)
    }

    @Post("/login_admin")
    async login_admin(@Body() dto: AdminDto) {
        return await this.nest2Service.login_admin(dto)
    }

    //@UseGuards(JwtAuthGuard)
    @Get('all_users')
    async all_users() {
        return await this.nest2Service.all_users()
    }

    @Post('/last_message')
    async last_message(@Body() dto: LastSenderDto) {
        return await this.nest2Service.last_message(dto)
    }
    
}

