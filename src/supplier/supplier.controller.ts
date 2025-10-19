import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get('/all')
  async getAllSuppliers(@I18n() i18n: I18nContext) {
    return this.supplierService.getAllSuppliers(i18n);
  }

  @Get(':id')
  async getSupplierById(@Param('id') id: string, @I18n() i18n: I18nContext) {
    return this.supplierService.getSupplierById(id, i18n);
  }

  @Post('create')
  async createSupplier(
    @Body() createSupplierDto: any,
    @I18n() i18n: I18nContext,
  ) {
    return this.supplierService.createSupplier(createSupplierDto, i18n);
  }
  @Put('update/:id')
  async updateSupplier(
    @Param('id') id: string,
    @Body() updateSupplierDto: any,
    @I18n() i18n: I18nContext,
  ) {
    return this.supplierService.updateSupplier(id, updateSupplierDto, i18n);
  }
  @Delete('delete/:id')
  async deleteSupplier(@Param('id') id: string, @I18n() i18n: I18nContext) {
    return this.supplierService.deleteSupplier(id, i18n);
  }
}
