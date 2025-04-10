import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
