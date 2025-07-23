import { JsonController, Get, Authorized, CurrentUser } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { AppDataSource } from '../config/data-source';
import { Task } from '../entities/task.entity';
import { User } from 'src/entities/user.entity';
import { TaskPriority, TaskStatus } from 'src/types/task.type';

@JsonController('/dashboard')
export class DashboardController {
  private taskRepo = AppDataSource.getRepository(Task);

  @Get()
  @Authorized()
  @OpenAPI({ summary: 'Estadisticas', security: [{ bearerAuth: [] }] })
  async getData(@CurrentUser() user: User) {
    const userId = user.id;

    const priorityRaw = await this.taskRepo
      .createQueryBuilder('task')
      .select('task.priority', 'priority')
      .addSelect('COUNT(*)', 'count')
      .where('task.userId = :userId', { userId })
      .groupBy('task.priority')
      .getRawMany();

    const statusRaw = await this.taskRepo
      .createQueryBuilder('task')
      .select('task.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('task.userId = :userId', { userId })
      .groupBy('task.status')
      .getRawMany();

    const priorityCounts: Record<string, number> = {};
    priorityRaw.forEach((row) => {
      priorityCounts[row.priority] = Number(row.count);
    });

    const statusCounts: Record<string, number> = {};
    statusRaw.forEach((row) => {
      statusCounts[row.status] = Number(row.count);
    });

    return {
      priority: {
        high: priorityCounts[TaskPriority.high] || 0,
        medium: priorityCounts[TaskPriority.medium] || 0,
        low: priorityCounts[TaskPriority.low] || 0,
      },
      status: {
        pending: statusCounts[TaskStatus.pending] || 0,
        in_progress: statusCounts[TaskStatus.in_progress] || 0,
        done: statusCounts[TaskStatus.done] || 0,
      },
    };
  }
}
