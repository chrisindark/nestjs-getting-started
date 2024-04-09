import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint()
export class OrderByValidator implements ValidatorConstraintInterface {
  validate(orderBy: string) {
    if (orderBy.toLowerCase() !== 'asc' && orderBy.toLowerCase() !== 'desc') {
      throw new BadRequestException(
        `Invalid orderBy value. Must be 'asc' or 'desc'.`,
      );
    }
    return true;
  }

  defaultMessage() {
    return `Invalid orderBy value. Must be 'asc' or 'desc'.`;
  }
}
