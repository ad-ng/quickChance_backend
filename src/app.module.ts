import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { OpportunityModule } from './opportunity/opportunity.module';
import { AppController } from './app.controller';
import { LikeModule } from './like/like.module';
import { SavedModule } from './saved/saved.module';
import { CommentModule } from './comment/comment.module';
//import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    CategoryModule,
    OpportunityModule,
    LikeModule,
    SavedModule,
    CommentModule,
    // NotificationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
