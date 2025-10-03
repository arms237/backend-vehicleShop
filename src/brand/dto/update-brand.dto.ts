import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class updateBrandTranslationsDto {
    @ApiProperty({
        description: 'Nom de la marque dans la langue spécifiée',
        example: 'Toyota',
        required: false
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'Description de la marque dans la langue spécifiée',
        example: 'Constructeur automobile japonais reconnu pour sa fiabilité',
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

export default class UpdateBrandDto {
    @ApiProperty({
        description: 'Slug unique de la marque (utilisé dans les URLs)',
        example: 'toyota',
        required: false
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: 'URL de l\'image de la marque',
        example: 'https://example.com/images/toyota-logo.png',
        required: false
    })
    @IsString()
    @IsOptional()
    image?: string;

    @ApiProperty({
        description: 'Traductions de la marque dans différentes langues',
        type: [updateBrandTranslationsDto],
        required: false
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => updateBrandTranslationsDto)
    @IsOptional()
    translations?: updateBrandTranslationsDto[];
}