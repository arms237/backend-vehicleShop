import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import  {CreateCategoryDto}  from './dto/create-category.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get('all')
    async getAllCategories() {
        return this.categoryService.getAllCategories();
    }

    @Get('/:id')
    async getCategoryById(@Param('id') id: string) {
        return this.categoryService.getCategoryById(id);
    }

    @Post('create')
    async createCategory(@Body() createCategoryDto: CreateCategoryDto, @I18n() i18nContext: I18nContext) {
        return this.categoryService.createCategory(createCategoryDto, i18nContext);
    }

    @Put('update/:id')
    async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @I18n() i18nContext: I18nContext) {
        return this.categoryService.updateCategory(id, updateCategoryDto, i18nContext);
    }

    @Delete('delete/:id')
    async deleteCategory(@Param('id') id: string, @I18n() i18nContext: I18nContext) {
        return this.categoryService.deleteCategory(id, i18nContext);
    }
}
