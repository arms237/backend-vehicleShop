import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCategoryTranslationsDto {
    @ApiProperty({
        description: 'Nom de la catégorie dans la langue spécifiée',
        example: 'Voitures de luxe',
        required: false
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'Description de la catégorie dans la langue spécifiée',
        example: 'Véhicules haut de gamme avec des finitions premium',
        required: false
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Code de la langue (ISO 639-1)',
        example: 'fr',
        required: false
    })
    @IsString()
    @IsOptional()
    language?: string;
}

export class UpdateCategoryDto {
    @ApiProperty({
        description: 'Slug unique de la catégorie (utilisé dans les URLs)',
        example: 'voitures-luxe',
        required: false
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: 'URL de l\'image de la catégorie',
        example: 'https://example.com/images/luxury-cars.jpg',
        required: false
    })
    @IsString()
    @IsOptional()
    image?: string;

    @ApiProperty({
        description: 'Traductions de la catégorie dans différentes langues',
        type: [UpdateCategoryTranslationsDto],
        required: false
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateCategoryTranslationsDto)
    @IsOptional()
    translations?: UpdateCategoryTranslationsDto[];
}