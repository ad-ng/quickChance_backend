import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SavedService {
  constructor(private prisma: PrismaService) {}

  async totalSaved(params) {
    const oppId: number = parseInt(params.oppId, 10);
    const checkOpp = await this.prisma.opportunity.findUnique({
      where: { id: oppId },
    });

    if (!checkOpp) throw new NotFoundException();

    try {
      const savedCount = await this.prisma.saved.count({
        where: { oppId: oppId },
      });

      return {
        message: 'all saved count',
        data: {
          count: savedCount,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
