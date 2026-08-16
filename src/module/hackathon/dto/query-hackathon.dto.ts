import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryHackathonDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
