import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';


@Injectable()
export class VehicleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async getAllVehicles(lang: string = 'fr') {
    try {
      const vehicles = await this.prisma.vehicle.findMany({
        include: {
          images: true,
          translations: {
            where: { languageId: lang },
          },
          admin: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          category: {
            include: {
              translations: {
                where: { languageId: lang },
              }
            }
          },
          brand: {
            include: {
              translations: {
                where: { languageId: lang },
              }
            }
          },
          supplier: {
            include: {
              translations: {
                where: { languageId: lang },
              }
            }
          },
        },
        orderBy: {
          createdAt: 'desc',
        }
      });

      return {
        message: await this.i18n.t('VEHICLE.LIST_SUCCESS', { lang }),
        vehicles,
        count: vehicles.length
      };
    } catch (error) {
      throw new InternalServerErrorException(
         this.i18n.t('VEHICLE.LIST_FAILED', { lang })
      );
    }
  }


  async getVehicleById(id: string, lang: string = 'fr') {
    try {
      const vehicle = await this.prisma.vehicle.findUnique({
        where: { id },
        include: {
          images: true,
          translations: {
            where: { languageId: lang },
          },
          admin: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          category: {
            include: {
              translations: {
                where: { languageId: lang },
              }
            }
          },
          brand: {
            include: {
              translations: {
                where: { languageId: lang },
              }
            }
          },
          supplier: {
            include: {
              translations: {
                where: { languageId: lang },
              }
            }
          },
        }
      });

      if (!vehicle) {
        throw new NotFoundException(
           this.i18n.t('VEHICLE.NOT_FOUND', { lang })
        );
      }

      return {
        message:  this.i18n.t('VEHICLE.DETAIL_SUCCESS', { lang }),
        vehicle
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
         this.i18n.t('VEHICLE.DETAIL_FAILED', { lang })
      );
    }
  }  

  async createVehicle(
    createVehicleDto: CreateVehicleDto,
    i18nContext: I18nContext,
  ) {
    const {
      // reference,
      model,
      bodyType,
      range,
      condition,
      status,
      stock,
      price,
      rentalPricePerDay,
      firstRegistration,
      countryOrigin,
      axleCount,
      axleBrand,
      mileage,
      emissionNorm,
      gearbox,
      enginePower,
      engineSize,
      dimensions,
      fuelType,
      tonnage,
      tires,
      cabinType,
      cabinEquipments,
      specificEquipments,
      adminId,
      categoryId,
      brandId,
      supplierId,
      images,
      translations,
    } = createVehicleDto;
    
    try {
      const adminExists = await this.prisma.user.findUnique({
        where: { id: adminId },
        select:{id: true, role: {select: {name: true}}}
      })

      if(!adminExists){
        throw new NotFoundException(this.i18n.translate('common.USER_NOT_FOUND', {
          lang: i18nContext.lang,
        }))
      }

      const vehicle = await this.prisma.vehicle.create({
        data: {
          //reference,
          model,
          bodyType,
          range,
          condition,
          status,
          stock,
          price,
          rentalPricePerDay,
          firstRegistration,
          countryOrigin,
          axleCount,
          axleBrand,
          mileage,
          emissionNorm,
          gearbox,
          enginePower,
          engineSize,
          dimensions,
          fuelType,
          tonnage,
          tires,
          cabinType,
          cabinEquipments,
          specificEquipments,
          admin: { connect: { id: adminId } },
          category: { connect: { id: categoryId } },
          brand: { connect: { id: brandId } },
          supplier: { connect: { id: supplierId } },
          images: images ? { create: images } : undefined,
          translations: translations ? { 
            create: translations.map(t => ({
              languageId: t.languageId,
              title: t.title,
              description: t.description,
            }))
          } : undefined,
        },
        include: {
          images: true,
          translations: true,
          admin: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          category: {
            include: {
              translations: true,
            }
          },
          brand: {
            include: {
              translations: true,
            }
          },
          supplier: {
            include: {
              translations: true,
            }
          },
        }
      });

      return {
        message: this.i18n.translate('common.vehicle.VEHICLE_CREATED', {
          lang: i18nContext.lang,
        }),
        vehicle,
      };
    } catch (error) {
     throw error;
    }
  }

  async updateVehicle(
    id: string,
    updateVehicleDto: UpdateVehicleDto,
    i18nContext: I18nContext,
  ) {
    try {
      // Vérification de l'existence du véhicule
      const existingVehicle = await this.prisma.vehicle.findUnique({
        where: { id },
        select: { id: true }
      });

      if (!existingVehicle) {
        throw new NotFoundException(
          this.i18n.translate('common.VEHICLE.NOT_FOUND', { lang: i18nContext.lang })
        );
      }

      const {
        adminId,
        categoryId,
        brandId,
        supplierId,
        images,
        translations,
        firstRegistration,
        ...vehicleData
      } = updateVehicleDto;

      // Vérifications des relations si elles sont mises à jour
      if (adminId) {
        const adminExists = await this.prisma.user.findUnique({
          where: { id: adminId },
          select: { id: true }
        });

        if (!adminExists) {
          throw new NotFoundException(
            this.i18n.translate('common.USER_NOT_FOUND', { lang: i18nContext.lang })
          );
        }
      }

      if (categoryId) {
        const categoryExists = await this.prisma.category.findUnique({
          where: { id: categoryId },
          select: { id: true }
        });

        if (!categoryExists) {
          throw new NotFoundException(
            this.i18n.translate('CATEGORY.NOT_FOUND', { lang: i18nContext.lang })
          );
        }
      }

      if (brandId) {
        const brandExists = await this.prisma.brand.findUnique({
          where: { id: brandId },
          select: { id: true }
        });

        if (!brandExists) {
          throw new NotFoundException(
             this.i18n.translate('BRAND.NOT_FOUND', { lang: i18nContext.lang })
          );
        }
      }

      if (supplierId) {
        const supplierExists = await this.prisma.supplier.findUnique({
          where: { id: supplierId },
          select: { id: true }
        });

        if (!supplierExists) {
          throw new NotFoundException(
            `Supplier with ID ${supplierId} not found`
          );
        }
      }

      // Mise à jour du véhicule
      const vehicle = await this.prisma.vehicle.update({
        where: { id },
        data: {
          ...vehicleData,
          firstRegistration: firstRegistration ? new Date(firstRegistration) : undefined,
          admin: adminId ? { connect: { id: adminId } } : undefined,
          category: categoryId ? { connect: { id: categoryId } } : undefined,
          brand: brandId ? { connect: { id: brandId } } : undefined,
          supplier: supplierId ? { connect: { id: supplierId } } : undefined,
          // Gestion des images et traductions lors de la mise à jour
          images: images ? {
            deleteMany: {},
            create: images
          } : undefined,
          translations: translations ? {
            deleteMany: {},
            create: translations.map(t => ({
              languageId: t.languageId,
              title: t.title,
              description: t.description,
            }))
          } : undefined,
        },
        include: {
          images: true,
          translations: true,
          admin: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          category: {
            include: {
              translations: true,
            }
          },
          brand: {
            include: {
              translations: true,
            }
          },
          supplier: {
            include: {
              translations: true,
            }
          },
        }
      });

      return {
        message:  this.i18n.translate('common.VEHICLE.UPDATE_SUCCESS', {
          lang: i18nContext.lang,
        }),
        vehicle,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      console.error('Erreur lors de la mise à jour du véhicule:', error);
      throw new InternalServerErrorException(
         this.i18n.translate('common.VEHICLE.UPDATE_FAILED', {
          lang: i18nContext.lang,
        })
      );
    }
  }


  async deleteVehicle(id: string, i18nContext: I18nContext) {
    try {
      // Vérification de l'existence du véhicule
      const existingVehicle = await this.prisma.vehicle.findUnique({
        where: { id },
        select: { id: true }
      });

      if (!existingVehicle) {
        throw new NotFoundException(
           this.i18n.translate('common.VEHICLE.NOT_FOUND', { lang: i18nContext.lang })
        );
      }

      // Suppression du véhicule (les relations en cascade seront automatiquement supprimées)
      await this.prisma.vehicle.delete({
        where: { id }
      });

      return {
        message:  this.i18n.translate('common.VEHICLE.DELETE_SUCCESS', {
          lang: i18nContext.lang,
        }),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      console.error('Erreur lors de la suppression du véhicule:', error);
      throw new InternalServerErrorException(
         this.i18n.translate('common.VEHICLE.DELETE_FAILED', {
          lang: i18nContext.lang,
        })
      );
    }
  }
}
