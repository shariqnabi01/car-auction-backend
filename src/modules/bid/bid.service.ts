
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.sservice';
import { AuctionService } from '../auction/auction.service';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { RabbitMQService } from '../../infrastructure/rabbitmq/rabbitmq.service';

@Injectable()
export class BidService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auctionService: AuctionService,
    private readonly redis: RedisService,
    private readonly rabbit: RabbitMQService,
  ) {}

  async placeBid(userId: string, auctionId: string, bidAmount: number) {
    return await this.prisma.$transaction(async (tx) => {
      const auction = await this.auctionService.validateAuctionActive(auctionId);

      if (bidAmount <= auction.currentBid) {
        throw new BadRequestException('Bid must be higher than current bid.');
      }

      const bid = await tx.bid.create({
        data: {
          userId,
          auctionId,
          amount: bidAmount,
        },
      });

      // Optimistic locking update
      const updatedAuction = await tx.auction.update({
        where: {
          id_version: {
            id: auctionId,
            version: auction.version,
          },
        },
        data: {
          currentBid: bidAmount,
          winnerId: userId,
          version: { increment: 1 },
        },
      });

      // Update Redis cache
      await this.redis.set(`auction:${auctionId}:currentBid`, bidAmount.toString());

      // Notify via RabbitMQ
      await this.rabbit.publish(process.env.RABBITMQ_BID_QUEUE || 'default-bid-queue', {
  type: 'NEW_BID',
  auctionId,
  bidAmount,
  userId,
});


      return bid;
    });
  }
}
