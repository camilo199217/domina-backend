import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { TaskPriority, TaskStatus } from 'src/types/task.type';

export class CreateTaskDto {
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskPriority)
  @IsNotEmpty()
  priority!: TaskPriority;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
