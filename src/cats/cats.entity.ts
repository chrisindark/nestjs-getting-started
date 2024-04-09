import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ObjectId,
  ObjectIdColumn,
} from 'typeorm';
import * as moment from 'moment';

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
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @BeforeInsert()
  updateTimestampsBeforeInsert() {
    this.createdAt = moment.utc().toDate();
    this.updatedAt = moment.utc().toDate();
  }

  @BeforeUpdate()
  updateTimestampsBeforeUpdate() {
    this.updatedAt = moment.utc().toDate();
  }
}
