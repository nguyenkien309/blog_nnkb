import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { useContainer } from 'class-validator';
import helmet from 'helmet';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ValidationConfig } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerService } from './logger/custom.logger';
import { ResponseTransformInterceptor } from './interceptor/response.transform.interceptor';
import { ValidatorsModule } from './validator/validator.module';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(helmet());

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.enableCors({
    origin: '*',
  });

  // useContainer(app.select(ValidatorsModule), { fallbackOnErrors: true });

  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalPipes(new ValidationPipe(ValidationConfig));
  app.setGlobalPrefix(configService.get<string>('apiPrefix'));
  useContainer(app.select(ValidatorsModule), { fallbackOnErrors: true });
  await ConfigDocument(app);

  const port = configService.get<number>('port');
  await app.listen(port, () => {
    console.log(`server is running on port : ${port}`);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();

async function ConfigDocument(app: INestApplication): Promise<void> {
  //
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addTag('Document For API')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  LoggerService.log(ConfigDocument.name);
}
