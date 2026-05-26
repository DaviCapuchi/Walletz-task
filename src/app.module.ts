import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClienteApiModule } from './cliente-api/cliente-api.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ClienteApiModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
