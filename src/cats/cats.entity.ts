import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class Cats {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  breed: string;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;
}
