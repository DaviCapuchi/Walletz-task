import { PartialType } from '@nestjs/mapped-types';
import { CreateDatabaseRuleDto } from './create-database-rule.dto';

export class UpdateDatabaseRuleDto extends PartialType(CreateDatabaseRuleDto) {}
