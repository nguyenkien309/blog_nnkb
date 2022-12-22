import { I18nModule } from './i18n/i18n.module';
import { TagModule } from './modules/tag/tag.module';
import { BlogLikeModule } from './modules/blog-like/blog-like.module';
import { BlogsModule } from './modules/blog/blog.module';
import { AllExceptionFilter } from './filter/exception.filter';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './database/database.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import { APP_FILTER } from '@nestjs/core';
import { UploadFileModule } from './modules/upload-file/upload-file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BlogCommentModule } from './modules/blog-comment/blog-comment.module';
import { ValidatorsModule } from './validator/validator.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development.local', '.env.development'],
      load: [appConfig, databaseConfig, authConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', '/public'),
      serveRoot: '/',
      exclude: ['/api/*', '/auth/*'],
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    LoggerModule,
    UploadFileModule,
    BlogsModule,
    BlogLikeModule,
    BlogCommentModule,
    TagModule,
    I18nModule,
    ValidatorsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {}
