import { BadRequestException, Injectable } from '@nestjs/common';
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

  async addCategory(dto: CategoryDTO) {
    const checkIfNameExist = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });

    if (checkIfNameExist) {
      throw new BadRequestException('category already exist');
    }

    const addedCategory = await this.prisma.category.create({ data: dto });

    return {
      message: 'Category Created Successfully',
      data: addedCategory,
    };
  }
}
