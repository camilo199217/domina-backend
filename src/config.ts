import * as dotenv from 'dotenv';
import { plainToInstance } from 'class-transformer';
import { IsString, IsNumber, validateSync } from 'class-validator';

dotenv.config();

class EnvironmentVariables {
  @IsString()
  POSTGRES_HOST!: string;

  @IsNumber()
  POSTGRES_PORT!: number;

  @IsString()
  POSTGRES_USER!: string;

  @IsString()
  POSTGRES_PASSWORD!: string;

  @IsString()
  POSTGRES_DB!: string;

  @IsNumber()
  PORT!: number;
}

// Transforma y valida
const validatedConfig = plainToInstance(EnvironmentVariables, process.env, {
  enableImplicitConversion: true, // convierte automáticamente strings a números
});

const errors = validateSync(validatedConfig, { whitelist: true });
if (errors.length > 0) {
  throw new Error(
    `❌ Error en variables de entorno:\n${errors
      .map((e) => Object.values(e.constraints || {}).join(', '))
      .join('\n')}`,
  );
}

export default validatedConfig;
