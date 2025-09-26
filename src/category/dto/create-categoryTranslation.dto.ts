import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryTranslationDto {
    @ApiProperty({
        description: 'Code de langue pour cette traduction',
        example: 'fr',
        enum: ['fr', 'en', 'it'],
    })
    language: string;

    @ApiProperty({
        description: 'Nom de la catégorie dans la langue spécifiée',
        example: 'Véhicules électriques',
    })
    name: string;

    @ApiPropertyOptional({
        description: 'Description de la catégorie dans la langue spécifiée',
        example: 'Catégorie regroupant tous les véhicules électriques',
    })
    description?: string;
}