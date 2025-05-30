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
import { NotificationsModule } from './notifications/notifications.module';
import { TwilioModule } from 'nestjs-twilio';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    CategoryModule,
    OpportunityModule,
    LikeModule,
    SavedModule,
    CommentModule,
    NotificationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
