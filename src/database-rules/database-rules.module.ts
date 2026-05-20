import { Module } from '@nestjs/common';
import { DatabaseRulesService } from './database-rules.service';
import { DatabaseRulesController } from './database-rules.controller';

@Module({
  controllers: [DatabaseRulesController],
  providers: [DatabaseRulesService],
})
export class DatabaseRulesModule {}
