import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    Req,
    Res,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/user.login-dto';
import { ConsoleLogger } from '@nestjs/common';
import { SignInUserDto } from './dto/sign-in.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
    private readonly logger = new ConsoleLogger(UserController.name);
    constructor(private readonly userService: UserService) {}

    @ApiBody({ type: CreateUserDto })
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        try {
            const user = await this.userService.createUser(createUserDto);
            return { user };
        } catch (error) {
            if (error.message === 'Email already exists') {
                throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
            } else {
                console.error('Error creating user:', error);
                throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Get()
    @ApiBearerAuth()
    findAll() {
        return this.userService.findAllUser();
    }

    @Get('/twitter')
    @UseGuards(AuthGuard('twitter'))
    async twitterLogin() {}

    @ApiExcludeEndpoint()
    @Get('/twitter/callback')
    @UseGuards(AuthGuard('twitter'))
    async twitterCallback(@Req() req, @Res() res) {
        const jwt = await this.userService.login(req.user);
        const { profile } = req.user;
        res.redirect(
            process.env.NODE_ENV === 'production'
                ? `${process.env.FE_PROD}/sign-in?accessToken=${jwt.accessToken}&username=${profile?.displayName}`
                : `${process.env.FE_DEVELOP}/sign-in?accessToken=${jwt.accessToken}&username=${profile?.displayName}`,
        );
    }

    @Get('/google')
    @UseGuards(AuthGuard('google'))
    async googleLogin() {}

    @ApiExcludeEndpoint()
    @Get('/google/callback')
    @UseGuards(AuthGuard('google'))
    async googleCallback(@Req() req, @Res() res) {
        const { displayName } = req.user;
        const jwt = await this.userService.login(req.user);
        res.set('authorization', jwt.accessToken);
        res.redirect(
            process.env.NODE_ENV === 'production'
                ? `${process.env.FE_PROD}/sign-in?accessToken=${jwt.accessToken}&username=${displayName}`
                : `${process.env.FE_DEVELOP}/sign-in?accessToken=${jwt.accessToken}&username=${displayName}`,
        );
    }

    @Get(':id')
    @ApiBearerAuth()
    findOne(@Param('id') id: string) {
        return this.userService.viewUser(+id);
    }

    @ApiBody({ type: SignInUserDto })
    @Post('/sign-in')
    @UseGuards(AuthGuard('local'))
    async login(@Request() req): Promise<LoginUserDto> {
        return this.userService.login(req.user);
    }

    @Patch()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    updateUserById(@Request() req, @Body() updateUserDto: UpdateUserDto): Promise<UpdateResult> {
        return this.userService.updateUser(req.user.id, updateUserDto);
    }

    @Delete()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    deleteUser(@Request() req): Promise<void> {
        return this.userService.removeUser(req.user.id);
    }
}
