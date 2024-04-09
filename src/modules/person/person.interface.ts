import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreatePersonBody {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  city: string;
}

export class GetPersonQuery {
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsNumber({}, { each: true })
  @Min(0)
  @Max(500)
  limit: number;

  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsNumber({}, { each: true })
  @Min(0)
  offset: number;
}

export class GetPersonParam {
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsNumber()
  id: number;
}

export class FilterPersonBody {
  @IsNumber({}, { each: true })
  @Min(10)
  @Max(500)
  limit: number = 10;

  @IsNumber({}, { each: true })
  @Min(0)
  offset: number = 0;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastName: string;
}

export class UpdatePersonBody {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  city: string;
}
