/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SavedGateway } from './saved.gateway';

@Injectable()
export class SavedService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => SavedGateway)) private savedGateway: SavedGateway,
  ) {}
  async totalSaved(oppId: number) {
    const checkOpp = await this.prisma.opportunity.findUnique({
      where: { id: oppId },
    });

    if (!checkOpp) throw new NotFoundException();

    try {
      const savedCount = await this.prisma.saved.count({
        where: { oppId: oppId },
      });

      return savedCount;
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
        orderBy: [{ id: 'desc' }],
        include: {
          opp: {
            include: { user: true, category: true },
          },
        },
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

      // Fetch Saved count
      const SavedCount = await this.totalSaved(oppId);

      // Reply back to the client
      this.savedGateway.server.to(oppId.toString()).emit('countSavedReply', {
        opportunityId: oppId,
        SavedCount,
      });

      // Fetch like count from DB
      const isSaved = await this.checkSaved(oppId, userId);

      // Reply back to the client
      this.savedGateway.server
        .to(`${oppId}-${userId}`)
        .emit('checkSavedReply', {
          opportunityId: userId,
          isSaved,
        });

      return {
        message: 'opp saved successfully',
        data: saveOpp,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteSave(param, user) {
    const oppId: number = parseInt(param.oppId, 10);
    const userid: number = user.id;
    const checkSave = await this.prisma.saved.findFirst({
      where: { oppId, userid },
    });

    if (!checkSave) throw new NotFoundException();

    try {
      await this.prisma.saved.deleteMany({ where: { oppId, userid } });

      // Fetch Saved count
      const SavedCount = await this.totalSaved(oppId);

      // Reply back to the client
      this.savedGateway.server.to(oppId.toString()).emit('countSavedReply', {
        opportunityId: oppId,
        SavedCount,
      });

      // Fetch like count from DB
      const isSaved = await this.checkSaved(oppId, userid);

      // Reply back to the client
      this.savedGateway.server
        .to(`${oppId}-${userid}`)
        .emit('checkSavedReply', {
          opportunityId: userid,
          isSaved,
        });

      return {
        message: 'saved deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async checkSaved(oppId: number, userId: number) {
    const checkOpp = await this.prisma.opportunity.findUnique({
      where: { id: oppId },
    });

    if (!checkOpp) throw new NotFoundException();

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
        return false;
      }

      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
