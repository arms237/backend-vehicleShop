import { IsString, IsArray, ValidateNested, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCategoryTranslationDto } from "./create-categoryTranslation.dto";

export class CreateCategoryDto {
    @ApiProperty({
        description: 'Slug unique de la catégorie',
        example: 'vehicules-electriques'
    })
    @IsString()
    slug: string;

    @ApiProperty({
        description: 'Traductions de la catégorie dans différentes langues',
        type: [CreateCategoryTranslationDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateCategoryTranslationDto)
    translations: CreateCategoryTranslationDto[];

    @ApiPropertyOptional({
        description: 'URL de l\'image de la catégorie',
        example: 'https://example.com/images/electric-vehicles.jpg'
    })
    @IsOptional()
    @IsString()
    image: string;
}