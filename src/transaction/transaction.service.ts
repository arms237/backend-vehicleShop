import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto, TransactionType } from './dto/create-transaction.dto';
import { StatusTransaction } from '@prisma/client';
import { AsyncResource } from 'async_hooks';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async getAllTransactions() {
    try {
      const transactions = await this.prisma.transaction.findMany({
        include: {
          vehicleTransactions: {
            include: {
              vehicle: {
                include: {
                  images: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });
      return transactions
    } catch (error) {
      console.error('Erreur récupération transactions:', error);
      throw new InternalServerErrorException(
        this.i18n.translate('common.errors.INTERNAL_SERVER_ERROR') ||
          'Erreur interne du serveur',
      );
    }
  }

  async getTransactionById(id: string) {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: {
        vehicleTransactions: {
          include: {
            vehicle: {
              include: {
                images: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async getTransactionsByUserId(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: {
        vehicleTransactions: {
          include: {
            vehicle: {
              include: {
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTransactionsByVehicleId(vehicleId: string) {
    return this.prisma.transaction.findMany({
      where: {
        vehicleTransactions: {
          some: {
            vehicleId,
          },
        },
      },
      include: {
        vehicleTransactions: {
          where: {
            vehicleId,
          },
          include: {
            vehicle: {
              include: {
                images: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    i18nContext: I18nContext,
  ) {
    if (!createTransactionDto) {
      throw new InternalServerErrorException(
        this.i18n.translate('common.errors.INVALID_DATA', {
          lang: i18nContext.lang,
        }) || 'Données invalides',
      );
    }

    const {
      totalAmount,
      type,
      startDate,
      endDate,
      status,
      userId,
      vehicleTransactions,
    } = createTransactionDto;

    // Validation des champs requis
    if (!totalAmount || !type || !status || !userId || !vehicleTransactions) {
      throw new InternalServerErrorException(
        this.i18n.translate('common.errors.MISSING_REQUIRED_FIELDS', {
          lang: i18nContext.lang,
        }) || 'Champs requis manquants',
      );
    }
     const formatDateToISO = (dateString: Date | undefined): Date | undefined => {
    if (!dateString) return undefined;
    
    // Si c'est déjà un format ISO complet, le garder
    if (String(dateString).includes('T')) {
      return new Date(dateString);
    }
    
    // Sinon, ajouter l'heure par défaut (00:00:00)
    return new Date(`${dateString}T00:00:00.000Z`);
  };
    try {
      const transaction = await this.prisma.transaction.create({
        data: {
          totalAmount,
          type: type as TransactionType,
          startDate: formatDateToISO(startDate),
          endDate: formatDateToISO(endDate),
          status: status as StatusTransaction,
          userId,
          vehicleTransactions: {
            create: vehicleTransactions,
          },
        },
        include: {
          vehicleTransactions: {
            include: {
              vehicle: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return transaction;
    } catch (error) {
      console.error('Erreur création transaction:', error);
      if (error instanceof InternalServerErrorException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          this.i18n.translate('common.errors.INTERNAL_SERVER_ERROR', {
            lang: i18nContext.lang,
          }),
        );
      }
    }
  }
  async updateTransactionStatus(id: string, status: StatusTransaction, i18nContext: I18nContext) {
    if (!id || !status) {
      throw new Error(this.i18n.t('errors.ID_AND_STATUS_REQUIRED'));
    }
    try{
      const transaction = await this.prisma.transaction.update({
        where: { id },
        data: { status },
      });
      return transaction;
    } catch (error) {
      console.error('Erreur mise à jour statut transaction:', error);
      if (error instanceof InternalServerErrorException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          this.i18n.translate('common.errors.INTERNAL_SERVER_ERROR', {
            lang: i18nContext.lang,
          }),
        );
      }
    }
  }
  async deleteTransaction(id: string, i18nContext: I18nContext) {
    if (!id) {
      throw new Error(this.i18n.t('errors.ID_REQUIRED'));
    }
    try {
      await this.prisma.transaction.delete({
        where: { id },
      });
      return { message: this.i18n.t('transaction.DELETE_SUCCESS') };
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          this.i18n.translate('common.errors.INTERNAL_SERVER_ERROR', {
            lang: i18nContext.lang,
          }),
        );
      }
    }
  }
}
