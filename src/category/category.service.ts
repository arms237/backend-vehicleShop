import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async getAllCategories() {
    return this.prisma.category.findMany({
      include: { translations: true },
    });
  }

  async getCategoryById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { translations: true },
    });
  }

  async createCategory(
    categoryDto: CreateCategoryDto,
    i18nContext: I18nContext,
  ) {
    const { translations, slug, image } = categoryDto;
    // Vérifier si le slug existe déjà
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug },
      include: { translations: true },
    });

    if (existingCategory) {
      throw new ConflictException(
        this.i18n.t('errors.SLUG_ALREADY_EXISTS', {
          lang: i18nContext.lang,
          args: { slug },
        }),
      );
    }

    //Mapper les traductions
    const mappedTranslations = translations.map((translation) => ({
      language: {
        connect: { id: translation.language }, // 'fr', 'en', 'it'
      },
      name: translation.name,
      description: translation.description,
    }));

    // Créer la catégorie avec ses traductions
    return {
      message: this.i18n.t('CATEGORY.CREATED_SUCCESS', {
        lang: i18nContext.lang,
      }),
      category: await this.prisma.category.create({
        data: {
          slug,
          image,
          translations: { create: mappedTranslations },
        },
        include: { translations: true },
      }),
    };
  }

  async updateCategory(
    id: string,
    categoryDto: UpdateCategoryDto,
    i18nContext: I18nContext,
  ) {
    const { translations, slug, image } = categoryDto;
    if (!id) {
      throw new NotFoundException(
        this.i18n.t('CATEGORY.INVALID_ID', { lang: i18nContext.lang }),
      );
    }
    // Vérifier si la catégorie existe
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
      include: { translations: true },
    });
    if (!existingCategory) {
      throw new NotFoundException(
        this.i18n.t('CATEGORY.NOT_FOUND', { lang: i18nContext.lang }),
      );
    }

    // Vérifier si le slug existe déjà pour une autre catégorie
    if (slug && slug !== existingCategory.slug) {
      const existingSlugCategory = await this.prisma.category.findUnique({
        where: { slug },
        include: { translations: true },
      });
      if (existingSlugCategory) {
        throw new ConflictException(
          this.i18n.t('CATEGORY.SLUG_ALREADY_EXISTS', {
            lang: i18nContext.lang,
            args: { slug },
          }),
        );
      }
    }

    const updateData: any = {};

    if (slug !== undefined) updateData.slug = slug;
    if (image !== undefined) updateData.image = image;

    if (translations && translations.length > 0) {
      const mappedTranslations = translations.map((translations) => ({
        language: { connect: { id: translations.language } },
        name: translations.name,
        description: translations.description,
      }));

      updateData.translations = {
        deleteMany: {},
        create: mappedTranslations,
      };
    }
    // Mettre à jour la catégorie avec ses nouvelles traductions
    return {
      message: this.i18n.t('CATEGORY.UPDATE_SUCCESS', {
        lang: i18nContext.lang,
      }),
      category: await this.prisma.category.update({
        where: { id },
        data: updateData,
        include: { translations: true },
      }),
    };
  }

  async deleteCategory(id: string, i18nContext: I18nContext) {
    // Vérifier si la catégorie existe
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!existingCategory) {
      throw new NotFoundException(
        this.i18n.t('CATEGORY.NOT_FOUND', { lang: i18nContext.lang }),
      );
    }
    // Supprimer la catégorie
    await this.prisma.category.delete({
      where: { id },
    });
    return {
      message: this.i18n.t('CATEGORY.DELETE_SUCCESS', {
        lang: i18nContext.lang,
      }),
    };
  }
}
