import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('person')
export class Person {
  @PrimaryColumn({ type: 'int', name: 'id', primary: true })
  id: number;

  @Column({ type: 'varchar', length: 255, name: 'firstName' })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 255 })
  city: string;

  @Column('timestamp', { name: 'createdAt' })
  createdAt: Date;

  @Column('timestamp', { name: 'updatedAt' })
  updatedAt: Date;
}
