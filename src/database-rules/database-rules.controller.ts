import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DatabaseRulesService } from './database-rules.service';
import { CreatePFDto } from './dto/create-profile.pf.dto';
import { UpdatePessoaJuridicaDto} from './dto/update-profile.pj.dto';

@Controller('database-rules')
export class DatabaseRulesController {
  constructor(private readonly databaseRulesService: DatabaseRulesService) {}

  @Post()
  create(@Body() createDatabaseRuleDto: CreateDatabaseRuleDto) {
    return this.databaseRulesService.create(createDatabaseRuleDto);
  }

  @Get()
  findAll() {
    return this.databaseRulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.databaseRulesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDatabaseRuleDto: UpdateDatabaseRuleDto) {
    return this.databaseRulesService.update(+id, updateDatabaseRuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.databaseRulesService.remove(+id);
  }
}
