import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Nest1Service } from './nest1.service';
import { CreateNestRegDto } from './dto/create-nest1.reg.dto';
import { LoginDto } from './dto/create_nest1.login.dto';


@Controller()
export class Nest1Controller {
  constructor(private readonly nest1Service: Nest1Service) { }

  @Post('/add_user')
  async add_user(@Body() dto: CreateNestRegDto) {
    return await this.nest1Service.add_user(dto)
  }

  @Post('/login')
  async login(@Body() dto: LoginDto) {
    return await this.nest1Service.login(dto)
  }

}




