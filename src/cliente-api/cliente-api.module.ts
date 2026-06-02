import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClienteApiService } from './cliente-api.service';
import { ClienteController } from './cliente-api.controller';
import { LoggerMiddleware } from 'src/auth/logger.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [ClienteController],
  providers: [ClienteApiService],
})
export class ClienteApiModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(LoggerMiddleware)
    .forRoutes('*')
  }
}
