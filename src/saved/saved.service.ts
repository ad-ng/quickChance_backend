import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SavedService {
  constructor(private prisma: PrismaService) {}

  async getTotalOfSave(params) {
    const oppId: number = parseInt(params.oppId, 10);
    const checkOpp = await this.prisma.opportunity.findUnique({
      where: { id: oppId },
    });

    if (!checkOpp) throw new NotFoundException();

    const totalSavedOpps: number = await this.prisma.saved.count({
      where: { oppId: oppId },
    });

    return {
      message: 'fetching total of all saved Opps',
      data: {
        total: totalSavedOpps,
      },
    };
  }
}
