import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/gurds/auth.guards';
import { CategoryService } from './category.service';

@UseGuards(AuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Get()
  allCategories() {
    return this.categoryService.getAllCategories();
  }
}
