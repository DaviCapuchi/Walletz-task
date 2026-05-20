import { Injectable } from '@nestjs/common';
import { CreateDatabaseRuleDto } from './dto/create-database-rule.dto';
import { UpdateDatabaseRuleDto } from './dto/update-database-rule.dto';

@Injectable()
export class DatabaseRulesService {
  create(createDatabaseRuleDto: CreateDatabaseRuleDto) {
    return 'This action adds a new databaseRule';
  }

  findAll() {
    return `This action returns all databaseRules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} databaseRule`;
  }

  update(id: number, updateDatabaseRuleDto: UpdateDatabaseRuleDto) {
    return `This action updates a #${id} databaseRule`;
  }

  remove(id: number) {
    return `This action removes a #${id} databaseRule`;
  }
}
