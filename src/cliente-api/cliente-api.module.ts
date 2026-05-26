import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClienteApiService } from './cliente-api.service';
import { ClienteController } from './cliente-api.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ClienteController],
  providers: [ClienteApiService],
})
export class ClienteApiModule {}
