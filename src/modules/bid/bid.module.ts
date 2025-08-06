// src/modules/bid/bid.module.ts
import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { AuctionModule } from '../auction/auction.module'; // ✅ import AuctionModule
import { RedisModule } from '../../infrastructure/redis/redis.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { RabbitMQModule } from '../../infrastructure/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    RabbitMQModule,
    AuctionModule, // ✅ fix: import the module that exports AuctionService
  ],
  providers: [BidService],
  exports: [BidService],
})
export class BidModule {}
