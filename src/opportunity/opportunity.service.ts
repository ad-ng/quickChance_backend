/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOppDTO } from './dto/createOpp.dto';
import { OpportunityStatus } from '@prisma/client';

@Injectable()
export class OpportunityService {
  constructor(private prisma: PrismaService) {}

  async fetchAllOpportunity() {
    const allOpportunity = await this.prisma.opportunity.findMany({
      orderBy: [{ id: 'desc' }],
      include: { user: true },
    });

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

  async searchOpportunities(searchQuery: string) {
    try {
      const opps = await this.prisma.opportunity.findMany({
        include: { user: true },
        where: {
          OR: [
            { title: { contains: searchQuery, mode: 'insensitive' } },
            { description: { contains: searchQuery, mode: 'insensitive' } },
            {
              category: {
                name: { contains: searchQuery, mode: 'insensitive' },
              },
            },
            { location: { contains: searchQuery, mode: 'insensitive' } },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return {
        message: 'Opportunity Searched Successfully !',
        data: opps,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async filterStatus(oppStatus: OpportunityStatus) {
    try {
      const opps = await this.prisma.opportunity.findMany({
        include: { user: true },
        where: {
          status: oppStatus,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return {
        message: 'Opportunity Searched Successfully !',
        data: opps,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
