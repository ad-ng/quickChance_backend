import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async updateCategory(dto: CategoryDTO, params) {
    const id = parseInt(params.id, 10);

    const doesCategoryExist = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!doesCategoryExist) {
      throw new NotFoundException();
    }

    const checkIfNameExist = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });

    if (checkIfNameExist) {
      throw new BadRequestException('category already exist');
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: dto,
    });

    return {
      message: 'Category',
      data: updatedCategory,
    };
  }
}
