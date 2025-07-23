import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  NotFoundError,
  BadRequestError,
  Authorized,
  CurrentUser,
  QueryParams,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { AppDataSource } from '../config/data-source';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from 'src/dtos/create-task.dto';
import { UpdateTaskDto } from 'src/dtos/update-task.dto';
import { User } from 'src/entities/user.entity';
import { TaskFilters } from 'src/dtos/task/list-filters.dto';

@JsonController('/tasks')
export class TaskController {
  private taskRepo = AppDataSource.getRepository(Task);

  @Get()
  @Authorized()
  @OpenAPI({ summary: 'Listar todas las tareas', security: [{ bearerAuth: [] }] })
  async getAll(@QueryParams() params: TaskFilters, @CurrentUser() user: User) {
    const offset = (params.page - 1) * params.size;

    const where: any = { userId: user.id };

    if (params.priority) {
      where.priority = params.priority;
    }

    if (params.status) {
      where.status = params.status;
    }

    const queryBuilder = this.taskRepo.createQueryBuilder('task').where(where);

    // Búsqueda por título
    if (params.search?.trim()) {
      const pattern = `%${params.search.trim().toLowerCase()}%`;
      queryBuilder.andWhere('LOWER(task.title) ILIKE :pattern', { pattern });
    }

    // Ordenamiento
    if (params.sort_by) {
      const order = params.descending === 'DESC' ? 'DESC' : 'ASC';
      queryBuilder.orderBy(`task.${params.sort_by}`, order);
    }

    // Paginación
    queryBuilder.skip(offset).take(params.size);

    // Conteo total (sin paginar)
    const total = await this.taskRepo.count({ where });

    // Obtener los items
    const items = await queryBuilder.getMany();

    return { total, items };
  }

  @Get('/:id')
  @OpenAPI({ summary: 'Obtener tarea por ID' })
  @ResponseSchema(Task)
  async getOne(@Param('id') id: string) {
    const task = await this.taskRepo.findOne({
      where: { id },
    });

    if (!task) throw new NotFoundError('Tarea no encontrada');
    return task;
  }

  @Post()
  @Authorized()
  @HttpCode(201)
  @OpenAPI({ summary: 'Crear nueva tarea', security: [{ bearerAuth: [] }] })
  @ResponseSchema(Task)
  async create(@Body() body: CreateTaskDto, @CurrentUser() user: User) {
    const task = this.taskRepo.create({ ...body, userId: user.id });

    try {
      return await this.taskRepo.save(task);
    } catch (error) {
      console.error('Error inesperado al guardar tarea:', error);
      throw new Error('Error interno al guardar la tarea.');
    }
  }

  @Put('/:id')
  @HttpCode(200)
  @OpenAPI({ summary: 'Actualizar una tarea' })
  async update(@Param('id') id: string, @Body() body: UpdateTaskDto) {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundError('Tarea no encontrada');

    Object.assign(task, body);

    try {
      await this.taskRepo.update(id, task);
    } catch (error) {
      throw error;
    }
  }

  @Delete('/:id')
  @HttpCode(204)
  @OpenAPI({ summary: 'Eliminar una tarea por ID' })
  async delete(@Param('id') id: string) {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundError('Tarea no encontrada');

    await this.taskRepo.remove(task);
    return;
  }
}
