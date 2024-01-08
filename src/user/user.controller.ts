import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/user.login-dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Get()
    findAll() {
        return this.userService.findAllUser();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.viewUser(+id);
    }

    @Post('/sign-in')
    @UseGuards(AuthGuard('local'))
    async login(@Request() req): Promise<LoginUserDto> {
        return this.userService.login(req.user);
    }

    @Patch()
    @UseGuards(AuthGuard('jwt'))
    updateUserById(@Request() req, @Body() updateUserDto: UpdateUserDto): Promise<UpdateResult> {
        return this.userService.updateUser(req.user.id, updateUserDto);
    }

    @Delete()
    @UseGuards(AuthGuard('jwt'))
    deleteUser(@Request() req): Promise<void> {
        return this.userService.removeUser(req.user.id);
    }
}
