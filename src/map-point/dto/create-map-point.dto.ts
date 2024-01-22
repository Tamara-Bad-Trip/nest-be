import { IsEmail, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class GeolocationDto {
    @IsNumber()
    @IsNotEmpty()
    lat: number;

    @IsNumber()
    @IsNotEmpty()
    lng: number;
}

export class CreateMapPointDto {
    @ValidateNested()
    @Type(() => GeolocationDto)
    geolocation: GeolocationDto;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEmail()
    @IsNotEmpty()
    creatorEmail: string;

    @IsString()
    @IsNotEmpty()
    creatorName: string;
}
