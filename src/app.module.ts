import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { PropertyModule } from './property/property.module';

@Module({
  imports: [ConfigModule.forRoot(), TasksModule, PropertyModule],
})
export class AppModule {}
