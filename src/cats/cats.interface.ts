import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetCatsQuery {
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

export class CreateCatBody {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  breed: string;
}

export class GetCatParam {
  @IsNotEmpty()
  @IsString()
  _id: string;
}

export class FilterCatBody {
  @IsNumber({}, { each: true })
  @Min(0)
  @Max(500)
  limit: number;

  @Transform(({ value }) => Number(value), { toClassOnly: true })
  @IsNumber({}, { each: true })
  @Min(0)
  offset: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  breed: string;
}

export class UpdateCatBody {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  breed: string;
}
