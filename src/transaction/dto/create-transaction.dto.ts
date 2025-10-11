import { IsEnum, IsNotEmpty, IsString, IsNumber, IsUUID, IsArray, ValidateNested, IsOptional, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum TransactionType {
  SALE = 'sale',
  RENTAL = 'rental',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
 
}


export class VehicleTransactionDto {
  @ApiProperty({
    description: 'Prix unitaire du véhicule',
    example: 50000,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Quantité de véhicules',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'ID du véhicule',
    example: 'uuid-vehicle-id',
  })
  @IsNotEmpty()
  @IsUUID()
  vehicleId: string;
}

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Montant total de la transaction',
    example: 50000,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({
    description: 'Type de transaction',
    enum: TransactionType,
    example: TransactionType.SALE,
  })
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: 'Date de début pour les locations',
    example: '2024-01-15T10:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiProperty({
    description: 'Date de fin pour les locations',
    example: '2024-01-20T10:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({
    description: 'Statut de la transaction',
    enum: TransactionStatus,
    example: TransactionStatus.PENDING,
  })
  @IsNotEmpty()
  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  @ApiProperty({
    description: 'Lien WhatsApp pour le support',
    example: 'https://wa.me/1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  whatsappLink?: string;

  @ApiProperty({
    description: 'ID de l\'utilisateur',
    example: 'uuid-user-id',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Liste des véhicules dans la transaction',
    type: [VehicleTransactionDto],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VehicleTransactionDto)
  vehicleTransactions: VehicleTransactionDto[];
}
