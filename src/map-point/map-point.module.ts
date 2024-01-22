import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapPointController } from './map-point.controller';
import { MapPointService } from './map-point.service';
import { MapPoint } from './entities/map-point.entity';

@Module({
    imports: [TypeOrmModule.forFeature([MapPoint])],
    controllers: [MapPointController],
    providers: [MapPointService],
    exports: [MapPointService],
})
export class MapPointsModule {}
