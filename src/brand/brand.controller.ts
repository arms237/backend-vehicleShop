import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { BrandService } from './brand.service';
import CreateBrandDto from './dto/create-brand.dto';
import UpdateBrandDto from './dto/update-brand.dto';

@ApiTags('Marques')
@Controller('brands')
@ApiBearerAuth()
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get('all')
  @ApiOperation({
    summary: 'Récupérer toutes les marques',
    description: 'Retourne la liste complète des marques avec leurs traductions',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Liste des marques récupérée avec succès',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-123' },
          slug: { type: 'string', example: 'toyota' },
          image: { type: 'string', example: 'https://example.com/logo.png' },
          translations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'uuid-456' },
                name: { type: 'string', example: 'Toyota' },
                description: { type: 'string', example: 'Constructeur japonais' },
                languageId: { type: 'string', example: 'fr' },
              },
            },
          },
        },
      },
    },
  })

  async getAllBrands() {
    return this.brandService.getAllBrands();
  }

  @Post('create')
  @ApiOperation({
    summary: 'Créer une nouvelle marque',
    description:
      'Crée une marque avec ses traductions dans différentes langues',
  })
  @ApiBody({ type: CreateBrandDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Marque créée avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Marque créée avec succès' },
        brand: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-123' },
            slug: { type: 'string', example: 'toyota' },
            image: { type: 'string', example: 'https://example.com/logo.png' },
            translations: { type: 'array' },
          },
        },
      },
    },
    })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Une marque avec ce slug existe déjà',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides',
  })
  async createBrand(@Body() createBrandDto: CreateBrandDto, @I18n() i18n: I18nContext) {
    return this.brandService.createBrand(createBrandDto, i18n);
  }

  @Put('update/:id')
  @ApiOperation({
    summary: 'Mettre à jour une marque',
    description: 'Met à jour une marque existante par son ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID unique de la marque',
    example: 'uuid-123',
  })
  @ApiBody({ type: UpdateBrandDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Marque mise à jour avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Marque mise à jour avec succès' },
        brand: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-123' },
            slug: { type: 'string', example: 'toyota' },
            image: { type: 'string', example: 'https://example.com/logo.png' },
            translations: { type: 'array' },
          },
        },
      },
    }
    })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Marque non trouvée',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Le slug existe déjà pour une autre marque',
  })
  async updateBrand(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
    @I18n() i18nContext: I18nContext,
  ) {
   
    return this.brandService.updateBrand(updateBrandDto, id, i18nContext);
  }

  @Delete('delete/:id')
  @ApiOperation({
    summary: 'Supprimer une marque',
    description: 'Supprime définitivement une marque par son ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID unique de la marque à supprimer',
    example: 'uuid-123',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Marque supprimée avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Marque supprimée avec succès' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Marque non trouvée',
  })
  async deleteBrand(@Param('id') id: string, @I18n() i18nContext: I18nContext) {
    return this.brandService.deleteBrand(id, i18nContext);
  }
}
