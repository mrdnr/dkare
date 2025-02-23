import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Response } from 'express';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('Proje - Görev - Alt Görev API dokümantasyonu')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.use('/docs-json', (res: Response) => {
    res.json(document);
  });

  app.use('/assets', express.static(join(process.cwd(), 'assets')));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
