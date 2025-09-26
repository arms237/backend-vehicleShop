import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class UpdateTranslationCategoryDto {
    @ApiPropertyOptional({
        description: 'Nom de la catégorie dans la langue spécifiée',
        example: 'Véhicules électriques'
    })
    name?: string;

    @ApiPropertyOptional({
        description: 'Description de la catégorie dans la langue spécifiée',
        example: 'Catégorie regroupant tous les véhicules électriques'
    })
    description?: string;

    @ApiPropertyOptional({
        description: 'Code de langue pour cette traduction',
        example: 'fr',
        enum: ['fr', 'en', 'it']
    })
    language?: string;
}

export class UpdateCategoryDto {
    @ApiPropertyOptional({
        description: 'Slug unique de la catégorie',
        example: 'vehicules-electriques'
    })
    slug?: string;

    @ApiPropertyOptional({
        description: 'Traductions de la catégorie dans différentes langues',
        type: [UpdateTranslationCategoryDto]
    })
    translations?: UpdateTranslationCategoryDto[];

    @ApiPropertyOptional({
        description: 'URL de l\'image de la catégorie',
        example: 'https://example.com/images/electric-vehicles.jpg'
    })
    image?: string;
}