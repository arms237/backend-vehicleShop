import { Injectable } from '@nestjs/common';
import { RoleName } from '@prisma/client';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async getAllUsers() {
    try {
      return await this.prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
          createdAt: true,
          isVerified: true,
          role: true,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          this.i18n.translate(error.message) || 'Erreur interne du serveur',
        );
      }
    }
  }

  async getUserById(id: string) {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          createdAt: true,
          isVerified: true,
          role: true,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          this.i18n.translate(error.message) || 'Erreur interne du serveur',
        );
      }
    }
  }

  async updateUserRole(
    id: string,
    roleName: RoleName,
    i18nContext: I18nContext,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error(
        this.i18n.translate('common.USER_NOT_FOUND', {
          lang: i18nContext.lang,
        }),
      );
    }

    try {
      const role = await this.prisma.role.findUnique({
        where: { name: roleName },
      });
      if (!role) {
        throw new Error(
          this.i18n.translate('common.ROLE_NOT_FOUND', {
            lang: i18nContext.lang,
          }),
        );
      }

      return await this.prisma.user.update({
        where: { id },
        data: { role: { connect: { id: role.id } } },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          this.i18n.translate(error.message) || 'Erreur interne du serveur',
        );
      }
    }
  }

  async deleteUser(id: string, i18nContext: I18nContext) {
    if (!id) {
      throw new Error(
        this.i18n.translate('common.INVALID_USER_ID', {
          lang: i18nContext.lang,
        }),
      );
    }
    try {
      await this.prisma.user.delete({ where: { id } });
      return { message: this.i18n.t('user.DELETE_SUCCESS') };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          this.i18n.translate(error.message) || 'Erreur interne du serveur',
        );
      }
    }
  }
}
