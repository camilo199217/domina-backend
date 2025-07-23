import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Expose, Type } from 'class-transformer';
import { TaskPriority, TaskStatus } from 'src/types/task.type';
import { User } from './user.entity';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100, nullable: false })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ enum: TaskPriority, enumName: 'task_priority', nullable: false })
  priority?: TaskPriority;

  @Column({
    default: TaskStatus.pending,
    enum: TaskStatus,
    enumName: 'task_status',
    nullable: true,
  })
  status?: TaskStatus;

  @Column({ type: 'date', nullable: true })
  dueDate?: Date;

  @ManyToOne(() => User, (u) => u.tasks)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'uuid' })
  userId!: string;
}
