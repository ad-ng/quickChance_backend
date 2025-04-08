import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryDTO } from './dtos';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAllCategories() {
    const allCats = await this.prisma.category.findMany();
    return {
      message: 'Categories found successfully',
      data: allCats,
    };
  }

  addCategory(dto: CategoryDTO) {
    return 'category added';
  }
}
