import { NestFactory } from '@nestjs/core';
import { DbSeederModule } from './db-seeder.module';
import { DbSeederService } from './db-seeder.service';

async function bootstrap() {
  const dbSeedApp = await NestFactory.createApplicationContext(DbSeederModule);
  const seedService = dbSeedApp.get(DbSeederService);
  console.log('Initializing database...');
  await seedService.seedDataBase();
  console.log('Done!');
  await dbSeedApp.close();
}
bootstrap();
