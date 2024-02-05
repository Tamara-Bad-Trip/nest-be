import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInUserDto {
    @IsString()
    @ApiProperty({
        default: 'taras@example.com',
    })
    readonly email: string;

    @IsString()
    @ApiProperty({
        default: 'Pass123$',
    })
    readonly password: string;
}
