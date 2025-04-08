import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/gurds/auth.guards';
import { CategoryService } from './category.service';
import { CategoryDTO } from './dtos';

@UseGuards(AuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Get()
  allCategories() {
    return this.categoryService.getAllCategories();
  }

  @Post()
  createCategory(@Body() dto: CategoryDTO) {
    return this.categoryService.addCategory(dto);
  }
}
