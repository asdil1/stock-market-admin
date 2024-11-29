import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    },
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.enableCors();

  await app.listen(3000, () => {
    Logger.log(
      `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
    );
  });
}
bootstrap();
