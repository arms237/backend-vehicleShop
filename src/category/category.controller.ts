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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Catégories')
@Controller('category')
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get( 'all')
  @ApiOperation({
    summary: 'Récupérer toutes les catégories',
    description: 'Retourne la liste complète des catégories avec leurs traductions'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Liste des catégories récupérée avec succès',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-123' },
          slug: { type: 'string', example: 'voitures-luxe' },
          image: { type: 'string', example: 'https://example.com/luxury-cars.jpg' },
          translations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'uuid-456' },
                name: { type: 'string', example: 'Voitures de luxe' },
                description: { type: 'string', example: 'Véhicules haut de gamme' },
                languageId: { type: 'string', example: 'fr' }
              }
            }
          }
        }
      }
    }
  })
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer une catégorie par ID',
    description: 'Retourne une catégorie spécifique avec ses traductions'
  })
  @ApiParam({
    name: 'id',
    description: 'ID unique de la catégorie',
    example: 'uuid-123'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Catégorie trouvée avec succès',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-123' },
        slug: { type: 'string', example: 'voitures-luxe' },
        image: { type: 'string', example: 'https://example.com/luxury-cars.jpg' },
        translations: { type: 'array' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Catégorie non trouvée'
  })
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Créer une nouvelle catégorie',
    description: 'Crée une catégorie avec ses traductions dans différentes langues'
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Catégorie créée avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Catégorie créée avec succès' },
        category: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-123' },
            slug: { type: 'string', example: 'voitures-luxe' },
            image: { type: 'string', example: 'https://example.com/luxury-cars.jpg' },
            translations: { type: 'array' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Une catégorie avec ce slug existe déjà'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides'
  })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto, @I18n() i18nContext: I18nContext) {
    return this.categoryService.createCategory(createCategoryDto, i18nContext);
  }

  @Put('update/:id')
  @ApiOperation({
    summary: 'Mettre à jour une catégorie',
    description: 'Met à jour une catégorie existante par son ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID unique de la catégorie',
    example: 'uuid-123'
  })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Catégorie mise à jour avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Catégorie mise à jour avec succès' },
        category: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-123' },
            slug: { type: 'string', example: 'voitures-luxe' },
            image: { type: 'string', example: 'https://example.com/luxury-cars.jpg' },
            translations: { type: 'array' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Catégorie non trouvée'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Le slug existe déjà pour une autre catégorie'
  })
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @I18n() i18nContext: I18nContext
  ) {
   
    return this.categoryService.updateCategory(id, updateCategoryDto, i18nContext);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Supprimer une catégorie',
    description: 'Supprime définitivement une catégorie par son ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID unique de la catégorie à supprimer',
    example: 'uuid-123'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Catégorie supprimée avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Catégorie supprimée avec succès' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Catégorie non trouvée'
  })
  async deleteCategory(@Param('id') id: string, @I18n() i18nContext: I18nContext) {
    return this.categoryService.deleteCategory(id, i18nContext);
  }
}
