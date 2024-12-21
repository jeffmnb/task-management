import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';
import { PropertyStatus } from '../property.types';

export class CreateNewPropertyDto {
  @IsString()
  @MinLength(5, { message: 'name is too short' })
  name: string;

  @IsNumber()
  @Min(4, { message: 'year is too short' })
  year: number;
}

export class GetPropertyByIdDTO {
  @IsUUID()
  id: string;
}

export class UpdatePropertyStatusDTO {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsEnum(PropertyStatus)
  status: PropertyStatus;
}
