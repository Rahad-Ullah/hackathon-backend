import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  IsAfterDate,
  IsFutureDate,
  IsTodayOrFutureDate,
} from '../../../common';

export class CreateHackathonDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  @MaxLength(2000, {
    message: 'Description cannot exceed 2000 characters',
  })
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  @IsTodayOrFutureDate({
    message: 'Start date must be today or a future date',
  })
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  @IsFutureDate({ message: 'End date must be a future date' })
  @IsAfterDate('startDate', {
    message: 'End date must be after the start date',
  })
  endDate: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
