import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/user.login-dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly authService: AuthService,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
        if (existingUser) {
            throw new Error('Email already exists');
        }

        const user: User = new User();
        user.email = createUserDto.email;
        user.username = createUserDto.username;
        user.password = await this.authService.hashPassword(createUserDto.password);

        return this.userRepository.save(user);
    }

    async findUserByEmail(email: string): Promise<User> {
        const selectedUser: User = await this.userRepository.findOne({ where: { email } });
        if (!selectedUser) throw new NotFoundException(`There is no user with email -> (${email})`);
        return selectedUser;
    }

    async login(loginUser: User): Promise<LoginUserDto> {
        try {
            const accessToken: string = await this.authService.generateJWT(loginUser);
            const { username } = loginUser;
            return { username, accessToken };
        } catch (error) {
            if (error.message.includes('There is no user with email') || error.message.includes('password is wrong')) {
                throw new HttpException('Wrong email or password', HttpStatus.UNAUTHORIZED);
            } else {
                throw error;
            }
        }
    }

    findAllUser(): Promise<User[]> {
        return this.userRepository.find();
    }

    viewUser(id: number): Promise<User> {
        return this.userRepository.findOneBy({ id });
    }

    async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
        return await this.userRepository.update(userId, updateUserDto);
    }

    async removeUser(userId: number): Promise<void> {
        await this.userRepository.delete(userId);
    }
}
