import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClienteApiService } from './cliente-api.service';
import { CreatePessoaDto } from './dto/create-cliente-api.dto';
import { UpdatePessoaDto } from './dto/update-cliente-api.dto';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteApiService: ClienteApiService) {}

  @Post()
  async create(@Body() createPessoaDto: CreatePessoaDto) {
    return this.clienteApiService.create(createPessoaDto);
  }

  @Get()
  async findAll() {
    return this.clienteApiService.findAll();
  }

  @Get('historico')
  async getHistorico() {
    return this.clienteApiService.getHistorico();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.clienteApiService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePessoaDto: UpdatePessoaDto,
  ) {
    return this.clienteApiService.update(id, updatePessoaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.clienteApiService.remove(id);
  }
}
