import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDTO } from './dtos';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RoleStatus } from '@prisma/client';

@UseGuards(AuthGuard, RolesGuard)
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  allCategories() {
    return this.categoryService.getAllCategories();
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Post()
  createCategory(@Body() dto: CategoryDTO) {
    return this.categoryService.addCategory(dto);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Patch(':id')
  updateCategory(@Body() dto: CategoryDTO, @Param() param: any) {
    return this.categoryService.updateCategory(dto, param);
  }

  @Roles(RoleStatus.admin, RoleStatus.moderator)
  @Delete(':id')
  deleteCategory(@Param() param: any) {
    return this.categoryService.removeCategory(param);
  }
}
