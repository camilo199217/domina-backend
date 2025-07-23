import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { useExpressServer } from 'routing-controllers';
import swaggerUi from 'swagger-ui-express';
import * as dotenv from 'dotenv';
import { routingControllersOptions } from './config/app';
import { swaggerSpec } from './config/swagger';
import { AppDataSource } from './config/data-source';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: 'http://domina.localhost:9000', // o '*', o una función dinámica
    credentials: true, // si necesitas cookies/autenticación
  }),
);

useExpressServer(app, routingControllersOptions);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
      console.log(`📚 Swagger disponible en http://localhost:${port}/docs`);
    });
  })
  .catch((err: unknown) => {
    console.error('Error al conectar la BD:', err);
  });
