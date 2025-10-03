import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryTranslationsDto {
    @ApiProperty({
        description: 'Nom de la catégorie dans la langue spécifiée',
        example: 'Voitures de luxe'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Description de la catégorie dans la langue spécifiée',
        example: 'Véhicules haut de gamme avec des finitions premium'
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: 'Code de la langue (ISO 639-1)',
        example: 'fr'
    })
    @IsString()
    @IsNotEmpty()
    language: string;
}

export class CreateCategoryDto {
    @ApiProperty({
        description: 'Slug unique de la catégorie (utilisé dans les URLs)',
        example: 'voitures-luxe'
    })
    @IsString()
    @IsNotEmpty()
    slug: string;

    @ApiPropertyOptional({
        description: 'URL de l\'image de la catégorie',
        example: 'https://example.com/images/luxury-cars.jpg'
    })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({
        description: 'Traductions de la catégorie dans différentes langues',
        type: [CreateCategoryTranslationsDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateCategoryTranslationsDto)
    translations: CreateCategoryTranslationsDto[];
}