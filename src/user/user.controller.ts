import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/user.login-dto';
import { ConsoleLogger } from '@nestjs/common';

@Controller('user')
export class UserController {
    private readonly logger = new ConsoleLogger(UserController.name);
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Get()
    findAll() {
        return this.userService.findAllUser();
    }

    @Get('/twitter')
    @UseGuards(AuthGuard('twitter'))
    async twitterLogin() {}

    @Get('/twitter/callback')
    @UseGuards(AuthGuard('twitter'))
    async twitterCallback(@Req() req, @Res() res) {
        const userData = JSON.stringify(req.user, undefined, 2);
        res.json(userData);
    }

    @Get('/google')
    @UseGuards(AuthGuard('google'))
    async googleLogin() {}

    @Get('/google/callback')
    @UseGuards(AuthGuard('google'))
    async googleCallback(@Req() req, @Res() res) {
        const jwt = await this.userService.login(req.user);
        res.set('authorization', jwt.accessToken);
        res.json(req.user);
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
