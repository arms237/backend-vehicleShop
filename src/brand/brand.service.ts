import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateBrandDto from './dto/create-brand.dto';
import UpdateBrandDto from './dto/update-brand.dto';

@Injectable()
export class BrandService {
 constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

    async getAllBrands() {
      return this.prisma.brand.findMany({include: { translations: true }});
    }

    async createBrand(
      createBrandDto: CreateBrandDto,
      i18ncontext: I18nContext,
    ) {
      const { slug, image, translations } = createBrandDto;
      const brand = await this.prisma.brand.findUnique({
        where: { slug },
        include: { translations: true },
      });
      if (brand) {
        throw new ConflictException(
          this.i18n.translate('common.BRAND.SLUG_ALREADY_EXISTS', {
            args: { slug },
            lang: i18ncontext.lang || 'fr',
          }),
        );
      }
      const mappedTranslations = translations.map((t) => ({
        language: { connect: { id: t.language } },
        name: t.name,
        description: t.description,
      }));

      return {
        message: this.i18n.translate('common.BRAND.CREATE_SUCCESS', {
          lang: i18ncontext.lang || 'fr',
        }),
        brand: await this.prisma.brand.create({
          data: {
            slug,
            image,
            translations: { create: mappedTranslations },
          },
          include: { translations: true },
        }),
      };
    }

    async updateBrand(updateBrandDto:UpdateBrandDto, id:string, i18nContext:I18nContext){
        const { slug, image, translations } = updateBrandDto;
        if(!id){
            throw new Error('ID is required');
        }
        const brand = await this.prisma.brand.findUnique({
          where: { id },
          include: { translations: true },
        });
        if (!brand) {
          throw new NotFoundException(
            this.i18n.translate('common.BRAND.NOT_FOUND', {
              lang: i18nContext.lang || 'fr',
            }),
          );
        }
        //Vérifier si le slug est modifié et s'il existe déjà
        if(slug && slug !== brand.slug){
            const existingSlugBrand = await this.prisma.brand.findUnique({
                where: { slug },
                include: { translations: true },
            })
            if(existingSlugBrand){
                throw new ConflictException(
                    this.i18n.translate('common.BRAND.SLUG_ALREADY_EXISTS', {
                      args: { slug },
                      lang: i18nContext.lang || 'fr',
                    }),
                  );
            }
        }

        const updateData: any = {}
        if(slug) updateData.slug = slug;
        if(image) updateData.image = image;
        if(translations && translations.length > 0){
            const mappedTranslations = translations.map((t) => ({
                language: {connect:{id: t.language}},
                name: t.name,
                description: t.description
            }))
            updateData.translations = {
                deleteMany:{},
                create: mappedTranslations
            }
        }

        return {
            message: this.i18n.translate('common.BRAND.UPDATE_SUCCESS', {
              lang: i18nContext.lang || 'fr',
            }),
            brand: await this.prisma.brand.update({
                where: { id },
                data: updateData,
                include: { translations: true },
            })
        }
    }

    async deleteBrand(id:string, i18nContext:I18nContext){
        if(!id){
            throw new Error('ID is required');
        }
        const brand = await this.prisma.brand.findUnique({
            where: {id},
            include :{translations: true}
        })
        if(!brand){
            throw new NotFoundException(
                this.i18n.translate('common.BRAND.NOT_FOUND', {
                  lang: i18nContext.lang || 'fr',
                }),
              );
        }
        await this.prisma.brand.delete({
            where: { id },
        });
        return {
            message: this.i18n.translate('common.BRAND.DELETE_SUCCESS', {
              lang: i18nContext.lang || 'fr',
            }),
        };
    }
}