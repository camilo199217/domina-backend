import { IsEnum, IsOptional } from 'class-validator';
import { PaginationParams } from '../pagination.dto';
import { TaskPriority, TaskStatus } from 'src/types/task.type';

export class TaskFilters extends PaginationParams {
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
