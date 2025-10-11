import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleStatus } from '@prisma/client';

@ApiTags('Véhicules')
@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}


  @Get('all')
  @ApiOperation({
    summary: 'Récupérer tous les véhicules',
    description: 'Retourne la liste complète des véhicules avec leurs traductions dans la langue spécifiée'
  })
  @ApiQuery({
    name: 'lang',
    required: false,
    description: 'Langue pour les traductions (fr, en, it)',
    example: 'fr'
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des véhicules récupérée avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Liste des véhicules récupérée avec succès' },
        vehicles: { type: 'array' },
        count: { type: 'number', example: 10 }
      }
    }
  })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  async getAllVehicles(@Query('lang') lang: string = 'fr') {
    return this.vehicleService.getAllVehicles(lang);
  }

 

  /**
   * Récupère un véhicule par son ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un véhicule par ID',
    description: 'Retourne les détails d\'un véhicule spécifique'
  })
  @ApiParam({
    name: 'id',
    description: 'ID unique du véhicule',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiQuery({
    name: 'lang',
    required: false,
    description: 'Langue pour les traductions',
    example: 'fr'
  })
  @ApiResponse({
    status: 200,
    description: 'Détails du véhicule récupérés avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Détails du véhicule récupérés avec succès' },
        vehicle: { type: 'object' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Véhicule non trouvé' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  async getVehicleById(
    @Param('id', ParseUUIDPipe) id: string,
    @I18n() i18n: I18nContext,
  ) {
    return this.vehicleService.getVehicleById(id, i18n);
  }


  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Créer un nouveau véhicule',
    description: 'Crée un nouveau véhicule avec ses images et traductions'
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Véhicule créé avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Véhicule créé avec succès' },
        vehicle: { type: 'object' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Ressource liée non trouvée' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  async createVehicle(
    @Body() createVehicleDto: CreateVehicleDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.vehicleService.createVehicle(createVehicleDto, i18n);
  }

  @Put('update/:id')
  @ApiOperation({
    summary: 'Mettre à jour un véhicule',
    description: 'Met à jour les informations d\'un véhicule existant'
  })
  @ApiParam({
    name: 'id',
    description: 'ID unique du véhicule à mettre à jour',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Véhicule mis à jour avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Véhicule mis à jour avec succès' },
        vehicle: { type: 'object' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Véhicule non trouvé' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  async updateVehicle(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.vehicleService.updateVehicle(id, updateVehicleDto, i18n);
  }

 
  @Delete('delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer un véhicule',
    description: 'Supprime définitivement un véhicule et ses données associées'
  })
  @ApiParam({
    name: 'id',
    description: 'ID unique du véhicule à supprimer',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'Véhicule supprimé avec succès'
  })
  @ApiResponse({ status: 404, description: 'Véhicule non trouvé' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  async deleteVehicle(
    @Param('id', ParseUUIDPipe) id: string,
    @I18n() i18n: I18nContext,
  ) {
    return this.vehicleService.deleteVehicle(id, i18n);
  }

  @Get('category/:id')
  @ApiOperation({
    summary: 'Afficher les vehicules par categorie',
    description: "Récupère tous les véhicules d'une catégorie spécifique"
  })
  async getVehicleByCategory (@Param('id', ParseUUIDPipe) id: string, @I18n() i18n: I18nContext){
    return this.vehicleService.getVehiclesByCategory(id,i18n)
  }
}