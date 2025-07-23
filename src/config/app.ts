import { RoutingControllersOptions } from 'routing-controllers';
import { AppDataSource } from './data-source';
import { verifyToken } from 'src/utils/jwt.util';
import { User } from 'src/entities/user.entity';
import { AuthController } from 'src/controllers/auth.controller';
import { TaskController } from 'src/controllers/task.controller';
import { DashboardController } from 'src/controllers/dashboard.controller';

export const routingControllersOptions: RoutingControllersOptions = {
  controllers: [AuthController, TaskController, DashboardController],
  defaults: {
    undefinedResultCode: 200,
  },
  authorizationChecker: async (action) => {
    const authHeader = action.request.headers['authorization'];
    if (!authHeader) return false;

    const token = authHeader.split(' ')[1];
    try {
      const payload = verifyToken(token);
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOneBy({ id: payload.id });

      if (!user) return false;

      // Guarda el usuario en la request para usar luego
      action.request.user = user;
      return true;
    } catch (err) {
      return false;
    }
  },
  currentUserChecker: async (action): Promise<User | null> => {
    return action.request.user || null;
  },
  validation: true,
};
