import { ConflictException, Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { isInstance } from 'class-validator';

@Injectable()
export class SupplierService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async getAllSuppliers(i18nContext: I18nContext) {
    const lang = i18nContext.lang || 'fr';
    try {
      return await this.prisma.supplier.findMany();
    } catch (error) {
      throw new Error(
        this.i18n.translate('common.errors.FAILED_TO_FETCH', { lang }),
      );
    }
  }

  async getSupplierById(id: string, i18nContext: I18nContext) {
    const lang = i18nContext.lang || 'fr';
    if (!id) {
      throw new Error(
        this.i18n.translate('common.errors.ID_REQUIRED', { lang }),
      );
    }

    try {
      return await this.prisma.supplier.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error(
        this.i18n.translate('common.errors.FAILED_TO_FETCH', { lang }),
      );
    }
  }

  async createSupplier(createSupplierDto: CreateSupplierDto, i18nContext: I18nContext) {
    const { name, address, phone, email } = createSupplierDto;
    const lang = i18nContext.lang || 'fr';
    if (!name) {
      throw new Error(
        this.i18n.translate('common.SUPPLIER.NAME_REQUIRED', { lang }),
      );
    }
    const existingSupplier = await this.prisma.supplier.findUnique({
      where: { name },
    });

    if (existingSupplier) {
      throw new ConflictException(
        this.i18n.translate('common.SUPPLIER.ALREADY_EXISTS', { lang }),
      );
    }

    try {
      return await this.prisma.supplier.create({
        data: {
          name,
          address,
          phone,
          email,
        },
      });
    } catch (error) {
      throw new Error(
        this.i18n.translate('common.errors.FAILED_TO_CREATE', { lang }),
      );
    }
  }

  async updateSupplier(
    id: string,
    updateData: Partial<CreateSupplierDto>,
    i18nContext: I18nContext,
  ) {
    const { name, address, phone, email } = updateData;
    const lang = i18nContext.lang || 'fr';

    if (!id) {
      throw new Error(
        this.i18n.translate('common.errors.ID_REQUIRED', { lang }),
      );
    }
    
    try {
      return await this.prisma.supplier.update({
        where: { id },
        data: {
          name,
          address,
          phone,
          email,
        },
      });
    } catch (error) {
      if (error instanceof ConflictException || error instanceof Error) {
        throw error;
      }
      console.error('Erreur lors de la mise a jour du fournisseur');
      throw new Error(
        this.i18n.translate('common.errors.FAILED_TO_UPDATE', { lang }),
      );
    }
  }

  async deleteSupplier(id: string, i18nContext: I18nContext) {
    const lang = i18nContext.lang || 'fr';
    if (!id) {
      throw new Error(
        this.i18n.translate('common.errors.ID_REQUIRED', { lang }),
      );
    }
    try {
      return await this.prisma.supplier.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      console.error('Erreur lors de la suppréssion du fournisseur');
      throw new Error(
        this.i18n.translate('common.errors.FAILED_TO_DELETE', { lang }),
      );
    }
  }
}
