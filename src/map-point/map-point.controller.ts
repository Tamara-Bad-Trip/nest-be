import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    HttpException,
    HttpStatus,
    ParseIntPipe,
    Put,
    Delete,
} from '@nestjs/common';
import { MapPointService } from './map-point.service';
import { CreateMapPointDto } from './dto/create-map-point.dto';
import { UpdateMapPointDto } from './dto/update-map-point.dto';

@Controller('map-points')
export class MapPointController {
    constructor(private readonly mapPointService: MapPointService) {}

    @Post()
    async create(@Body() createMapPointDto: CreateMapPointDto) {
        try {
            await this.mapPointService.createMapPoint(createMapPointDto);
            return { success: true };
        } catch (error) {
            console.error('Error creating point:', error.message);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/get-all-points')
    async findAll(@Body() { email }: { email: string }) {
        return this.mapPointService.findPointsByEmail(email);
    }

    @Put()
    async update(@Body() updateMapPointDto: UpdateMapPointDto) {
        try {
            const updateResult = await this.mapPointService.updateMapPoint(updateMapPointDto);
            if (updateResult.affected === 0) {
                throw new HttpException('Map point not found', HttpStatus.NOT_FOUND);
            }
            return { success: true };
        } catch (error) {
            console.error('Error updating point:', error);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) pointId: number) {
        try {
            await this.mapPointService.removeMapPoint(pointId);
            return { success: true };
        } catch (error) {
            console.error('Error deleting point:', error);
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
