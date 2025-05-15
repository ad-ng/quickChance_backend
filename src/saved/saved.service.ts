/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
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

  async allMySaves(user) {
    const checkUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!checkUser) throw new UnauthorizedException();

    try {
      const allSaves = await this.prisma.saved.findMany({
        where: { userid: user.id },
        include: { opp: true, user: true },
      });
      return {
        message: 'fetching saved opps',
        data: allSaves,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async savingOpp(param, user) {
    const oppId: number = parseInt(param.oppId, 10);
    const checkOpp = await this.prisma.opportunity.findUnique({
      where: { id: oppId },
    });

    if (!checkOpp) throw new NotFoundException('Opp not found');

    const userId = user.id;

    try {
      const saveOpp = await this.prisma.saved.create({
        data: {
          oppId: oppId,
          userid: userId,
        },
      });
      return {
        message: 'opp saved successfully',
        data: saveOpp,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteSave(param) {
    const id: number = parseInt(param.id, 10);
    const checkSave = await this.prisma.saved.findUnique({ where: { id } });

    if (!checkSave) throw new NotFoundException();

    try {
      await this.prisma.saved.delete({ where: { id } });
      return {
        message: 'saved deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async checkSaved(param, user) {
    const oppId: number = parseInt(param.oppId, 10);
    const checkOpp = await this.prisma.opportunity.findUnique({
      where: { id: oppId },
    });

    if (!checkOpp) throw new NotFoundException();

    const userId: number = user.id;
    const checkUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!checkUser) throw new UnauthorizedException();

    try {
      const savedChecking = await this.prisma.saved.findUnique({
        where: {
          oppId_userid: {
            oppId: oppId,
            userid: userId,
          },
        },
      });
      if (!savedChecking) {
        return {
          message: 'fetch is saved',
          data: {
            isSaved: false,
          },
        };
      }

      return {
        message: 'fetch is saved',
        data: {
          isSaved: true,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
