import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint()
export class SortByValidator implements ValidatorConstraintInterface {
  validate(value: string) {
    const allowedValues = ['_id', 'createdAt', 'updatedAt'];
    return allowedValues.includes(value);
  }

  defaultMessage() {
    return `Invalid sortBy value. Must be '_id', 'createdAt', 'updatedAt'.`;
  }
}
