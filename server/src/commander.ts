import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';
import { CommanderModule } from '@src/modules/commander/commander.module';

async function bootstrap() {
  await CommandFactory.run(CommanderModule, ['warn', 'error']);
}

bootstrap();
