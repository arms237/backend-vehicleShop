import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class UpdateTranslationCategoryDto {
    @ApiPropertyOptional({
        description: 'Category name in the specified language',
        example: 'Electric Vehicles'
    })
    name?: string;

    @ApiPropertyOptional({
        description: 'Category description in the specified language',
        example: 'Category for all electric and hybrid vehicles'
    })
    description?: string;

    @ApiPropertyOptional({
        description: 'Language code for this translation',
        example: 'en',
        enum: ['fr', 'en', 'it']
    })
    language?: string;
}

export class UpdateCategoryDto {
    @ApiPropertyOptional({
        description: 'Unique category slug',
        example: 'electric-vehicles'
    })
    slug?: string;

    @ApiPropertyOptional({
        description: 'Category translations in different languages',
        type: [UpdateTranslationCategoryDto]
    })
    translations?: UpdateTranslationCategoryDto[];

    @ApiPropertyOptional({
        description: 'Category image URL',
        example: 'https://example.com/images/electric-vehicles.jpg'
    })
    image?: string;
}