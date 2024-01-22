import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MapPoint {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('json')
    geolocation: {
        lat: number;
        lng: number;
    };

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    creatorEmail: string;

    @Column()
    creatorName: string;
}
