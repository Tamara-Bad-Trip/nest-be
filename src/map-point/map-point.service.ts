import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { MapPoint } from './entities/map-point.entity';
import { CreateMapPointDto } from './dto/create-map-point.dto';
import { UpdateMapPointDto } from './dto/update-map-point.dto';

@Injectable()
export class MapPointService {
    constructor(@InjectRepository(MapPoint) private readonly mapPointRepository: Repository<MapPoint>) {}

    async createMapPoint(createMapPoint: CreateMapPointDto): Promise<MapPoint> {
        const newPoint: MapPoint = new MapPoint();
        newPoint.geolocation = {
            lat: createMapPoint.geolocation.lat,
            lng: createMapPoint.geolocation.lng,
        };
        newPoint.creatorName = createMapPoint.creatorName;
        newPoint.creatorEmail = createMapPoint.creatorEmail;
        newPoint.description = createMapPoint.description;
        newPoint.title = createMapPoint.title;

        return this.mapPointRepository.save(newPoint);
    }

    async updateMapPoint(updateMapPointDto: UpdateMapPointDto): Promise<UpdateResult> {
        return await this.mapPointRepository.update(updateMapPointDto.id, updateMapPointDto);
    }

    async removeMapPoint(pointId: number): Promise<void> {
        await this.mapPointRepository.delete(pointId);
    }

    async findPointsByEmail(email: string): Promise<MapPoint[]> {
        const query = `SELECT * FROM public.map_point WHERE "creatorEmail" = $1`;
        return this.mapPointRepository.query(query, [email]);
    }
}
