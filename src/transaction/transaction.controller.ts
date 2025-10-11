import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { StatusTransaction } from '@prisma/client';

@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Get('all')
    async getAllTransactions() {
        return this.transactionService.getAllTransactions();
    }

    @Get(':id')
    async getTransactionById(id: string) {
        return this.transactionService.getTransactionById(id);
    }

    @Get('user/:userId')
    async getTransactionsByUserId(@Param('userId') userId: string) {
        return this.transactionService.getTransactionsByUserId(userId);
    }

    @Get('vehicle/:vehicleId')
    async getTransactionsByVehicleId(@Param('vehicleId') vehicleId: string) {
        return this.transactionService.getTransactionsByVehicleId(vehicleId);
    }

    @Post('create')
    async createTransaction(@Body() createTransactionDto: CreateTransactionDto, @I18n() i18n: I18nContext) {
        const message = i18n.t('transaction.created');
        return this.transactionService.createTransaction(createTransactionDto,i18n);
    }

    @Patch('update/:id/status')
    async updateTransaction(@Param('id') id:string, @Body('status') status:StatusTransaction, @I18n() i18n:I18nContext) {
        return this.transactionService.updateTransactionStatus(id, status, i18n);
    }

    @Delete('delete/:id')
    async deleteTransaction(@Param('id') id:string, @I18n() i18n:I18nContext) {
        return this.transactionService.deleteTransaction(id, i18n);
    }
}