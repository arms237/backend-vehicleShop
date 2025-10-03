import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsInt, 
  IsDecimal, 
  IsDateString, 
  IsUUID, 
  Min, 
  IsArray, 
  ValidateNested 
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { VehicleStatus } from '@prisma/client';

export class CreateVehicleImageDto {
  @ApiProperty({
    description: 'URL de l\'image du véhicule',
    example: 'https://example.com/image.jpg'
  })
  @IsString()
  url: string;

  @ApiPropertyOptional({
    description: 'Texte alternatif pour l\'accessibilité',
    example: 'Vue latérale du camion Mercedes'
  })
  @IsOptional()
  @IsString()
  alt?: string;

  @ApiPropertyOptional({
    description: 'Indique si c\'est l\'image principale',
    example: true,
    default: false
  })
  @IsOptional()
  isMain?: boolean;
}

export class CreateVehicleTranslationDto {
  @ApiProperty({
    description: 'Code de la langue (fr, en, it)',
    example: 'fr'
  })
  @IsString()
  languageId: string;

  @ApiPropertyOptional({
    description: 'Titre du véhicule dans cette langue',
    example: 'Camion Mercedes Actros 2020'
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Description détaillée du véhicule',
    example: 'Excellent camion en parfait état, idéal pour le transport longue distance'
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateVehicleDto {
  // @ApiProperty({
  //   description: 'Référence unique du véhicule',
  //   example: 'VH-2024-001'
  // })
  // @IsString()
  // reference: string;

  @ApiProperty({
    description: 'Modèle du véhicule',
    example: 'Actros 1845'
  })
  @IsString()
  model: string;

  @ApiPropertyOptional({
    description: 'Type de carrosserie',
    example: 'Porteur'
  })
  @IsOptional()
  @IsString()
  bodyType?: string;

  @ApiPropertyOptional({
    description: 'Gamme du véhicule',
    example: 'Premium'
  })
  @IsOptional()
  @IsString()
  range?: string;

  @ApiProperty({
    description: 'État du véhicule',
    example: 'Excellent'
  })
  @IsString()
  condition: string;

  @ApiPropertyOptional({
    description: 'Statut du véhicule',
    enum: VehicleStatus,
    example: VehicleStatus.available,
    default: VehicleStatus.available
  })
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @ApiPropertyOptional({
    description: 'Quantité en stock',
    example: 1,
    minimum: 0,
    default: 1
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    description: 'Prix de vente en euros',
    example: 45000.99,
    type: 'number'
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  price?: number;

  @ApiPropertyOptional({
    description: 'Prix de location par jour en euros',
    example: 299.99,
    type: 'number'
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  rentalPricePerDay?: number;

  @ApiPropertyOptional({
    description: 'Date de première immatriculation',
    example: '2020-01-15T00:00:00.000Z'
  })
  @IsOptional()
  @IsDateString()
  firstRegistration?: string;

  @ApiPropertyOptional({
    description: 'Pays d\'origine',
    example: 'France'
  })
  @IsOptional()
  @IsString()
  countryOrigin?: string;

  @ApiPropertyOptional({
    description: 'Nombre d\'essieux',
    example: 2,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  axleCount?: number;

  @ApiPropertyOptional({
    description: 'Marque des essieux',
    example: 'SAF'
  })
  @IsOptional()
  @IsString()
  axleBrand?: string;

  @ApiPropertyOptional({
    description: 'Kilométrage',
    example: 150000,
    minimum: 0
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  mileage?: number;

  @ApiPropertyOptional({
    description: 'Norme d\'émission',
    example: 'Euro 6'
  })
  @IsOptional()
  @IsString()
  emissionNorm?: string;

  @ApiPropertyOptional({
    description: 'Type de boîte de vitesses',
    example: 'Automatique'
  })
  @IsOptional()
  @IsString()
  gearbox?: string;

  @ApiPropertyOptional({
    description: 'Puissance du moteur en chevaux',
    example: 450,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  enginePower?: number;

  @ApiPropertyOptional({
    description: 'Cylindrée du moteur en cm³',
    example: 12800,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  engineSize?: number;

  @ApiPropertyOptional({
    description: 'Dimensions du véhicule (L x l x h)',
    example: '12.5m x 2.5m x 4m'
  })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiPropertyOptional({
    description: 'Type de carburant',
    example: 'Diesel'
  })
  @IsOptional()
  @IsString()
  fuelType?: string;

  @ApiPropertyOptional({
    description: 'Tonnage du véhicule',
    example: '26T'
  })
  @IsOptional()
  @IsString()
  tonnage?: string;

  @ApiPropertyOptional({
    description: 'Informations sur les pneus',
    example: '315/70 R22.5'
  })
  @IsOptional()
  @IsString()
  tires?: string;

  @ApiPropertyOptional({
    description: 'Type de cabine',
    example: 'Cabine couchette'
  })
  @IsOptional()
  @IsString()
  cabinType?: string;

  @ApiPropertyOptional({
    description: 'Équipements de la cabine',
    example: 'Climatisation, GPS, Frigo'
  })
  @IsOptional()
  @IsString()
  cabinEquipments?: string;

  @ApiPropertyOptional({
    description: 'Équipements spécifiques',
    example: 'Grue, Plateau basculant'
  })
  @IsOptional()
  @IsString()
  specificEquipments?: string;

  @ApiProperty({
    description: 'ID de l\'administrateur qui gère ce véhicule',
    example: '123e4567-e89b-12d3-a456-426614174003'
  })
  @IsUUID()
  adminId: string;

  @ApiProperty({
    description: 'ID de la catégorie',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    description: 'ID de la marque',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsUUID()
  brandId: string;

  @ApiProperty({
    description: 'ID du fournisseur',
    example: '123e4567-e89b-12d3-a456-426614174002'
  })
  @IsUUID()
  @IsOptional()
  supplierId: string;

  @ApiPropertyOptional({
    description: 'Images du véhicule',
    type: [CreateVehicleImageDto],
    example: [
      {
        url: 'https://example.com/image1.jpg',
        alt: 'Vue avant',
        isMain: true
      }
    ]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVehicleImageDto)
  images?: CreateVehicleImageDto[];

  @ApiPropertyOptional({
    description: 'Traductions du véhicule',
    type: [CreateVehicleTranslationDto],
    example: [
      {
        languageId: 'fr',
        title: 'Camion Mercedes Actros',
        description: 'Excellent état, faible kilométrage'
      }
    ]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVehicleTranslationDto)
  translations?: CreateVehicleTranslationDto[];
}
