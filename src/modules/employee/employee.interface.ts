import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetEmployeeParam {
  @IsNotEmpty()
  @IsString()
  uuid: string;
}

export class FilterEmployeeBody {
  @IsNumber({}, { each: true })
  @Min(10)
  @Max(500)
  limit: number = 10;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastName: string;
}
