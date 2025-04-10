import { Injectable } from '@nestjs/common';
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
}
