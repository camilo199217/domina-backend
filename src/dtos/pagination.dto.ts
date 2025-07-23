import { IsOptional, IsInt, Min, Max, IsString, MaxLength, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  size: number = 10;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  descending: 'ASC' | 'DESC' = 'ASC';

  @IsOptional()
  @IsString()
  @MaxLength(50)
  sort_by?: string;
}
