/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOppDTO } from './dto/createOpp.dto';

@Injectable()
export class OpportunityService {
  constructor(private prisma: PrismaService) {}

  async fetchAllOpportunity() {
    const allOpportunity = await this.prisma.opportunity.findMany();

    return {
      message: 'opportunity fetched successfully',
      data: allOpportunity,
    };
  }

  async fetchOneById(params) {
    const id = parseInt(params.id, 10);
    const checkOpp = await this.prisma.opportunity.findUnique({
      where: { id },
    });

    if (!checkOpp) {
      throw new NotFoundException();
    }

    return {
      message: 'property found successfully',
      data: checkOpp,
    };
  }

  async createOpp(dto: CreateOppDTO, user) {
    const userId: number = user.id;

    try {
      const newOpp = await this.prisma.opportunity.create({
        data: {
          title: dto.title,
          description: dto.description,
          status: dto.status,
          categoryId: dto.categoryId,
          userId,
          deadline: dto.deadline,
          location: dto.location,
        },
      });

      return {
        message: 'Opportunity Created Successfully !',
        data: newOpp,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateById(dto: CreateOppDTO, params) {
    const id: number = parseInt(params.id, 10);

    const checkOpp = await this.prisma.opportunity.findUnique({
      where: { id },
    });

    if (!checkOpp) {
      throw new NotFoundException();
    }

    try {
      const updatedOpp: object = await this.prisma.opportunity.update({
        where: { id },
        data: dto,
      });

      return {
        message: 'Opportunity Updated Successfully',
        data: updatedOpp,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteOppById(params) {
    const id = parseInt(params.id, 10);

    const checkOpp = await this.prisma.opportunity.findUnique({
      where: { id },
    });

    if (!checkOpp) {
      throw new NotFoundException();
    }

    try {
      await this.prisma.opportunity.delete({ where: { id } });

      return {
        message: 'Opportunity Deleted Successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
