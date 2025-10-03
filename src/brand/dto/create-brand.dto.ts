import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBrandTranslationsDto {
    @ApiProperty({
        description: 'Nom de la marque dans la langue spécifiée',
        example: 'Toyota'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Description de la marque dans la langue spécifiée',
        example: 'Constructeur automobile japonais reconnu pour sa fiabilité'
    })
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({
        description: 'Code de la langue (ISO 639-1)',
        example: 'fr'
    })
    @IsString()
    @IsNotEmpty()
    language: string;
}

export default class CreateBrandDto {
    @ApiProperty({
        description: 'Slug unique de la marque (utilisé dans les URLs)',
        example: 'toyota'
    })
    @IsString()
    @IsNotEmpty()
    slug: string;

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
        type: [CreateBrandTranslationsDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateBrandTranslationsDto)
    translations: CreateBrandTranslationsDto[];
}