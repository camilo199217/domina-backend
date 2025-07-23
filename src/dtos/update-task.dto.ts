import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TaskPriority, TaskStatus } from 'src/types/task.type';

export class UpdateTaskDto {
  @MaxLength(100)
  @IsString()
  @IsOptional()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority!: TaskPriority;

  @IsEnum(TaskStatus)
  @IsOptional()
  status!: TaskStatus;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
