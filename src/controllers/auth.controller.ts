import {
  JsonController,
  Post,
  Body,
  UnauthorizedError,
  UnprocessableEntityError,
  HttpCode,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { AppDataSource } from '../config/data-source';
import { User } from 'src/entities/user.entity';
import { generateToken } from 'src/utils/jwt.util';
import { LoginResponse } from 'src/interfaces/auth.interface';
import { LoginRequest } from 'src/dtos/login.dto';
import { RegisterUser } from 'src/dtos/user/register-user.dto';
import { QueryFailedError } from 'typeorm';

@JsonController('/auth')
export class AuthController {
  private userRepo = AppDataSource.getRepository(User);

  @Post('/register')
  @HttpCode(200)
  @OpenAPI({
    summary: 'Registrar un usuario',
    requestBody: {
      content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterUser' } } },
    },
    responses: {
      200: {
        description: 'Usuario registrado',
      },
      422: {
        description: 'Correo electrónico ya registrado',
      },
    },
  })
  async register(@Body() body: RegisterUser): Promise<void> {
    const user = this.userRepo.create({ ...body });

    try {
      await this.userRepo.save(user);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        const driverError: any = e.driverError;

        if (driverError.constraint === 'uq_users_email')
          throw new UnprocessableEntityError('user_email_already_exists');
      }
      console.log('nqaall');
      throw e;
    }
  }

  @Post('/login')
  @OpenAPI({
    summary: 'Inicio de sesión con correo',
    requestBody: {
      content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
    },
    responses: {
      200: {
        description: 'Inicio de sesión exitoso',
      },
      401: {
        description: 'Credenciales inválidas',
      },
    },
  })
  async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    const { email, password } = body;
    const user = await this.userRepo.findOneBy({ email });

    if (!user || !(await user.checkPassword(password))) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = generateToken({ id: user.id });
    return { tokenType: 'Bearer', accessToken: token };
  }
}
