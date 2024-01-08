import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity()
export class User {
  @Column({ type: 'varchar', length: 15 })
  username: string;
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false, unique: true })
  email: string;
  @Column({ nullable: false })
  password: string;
  @BeforeInsert()
	emailToLowerCase () {
	    this.email = this.email.toLowerCase();
	}
}