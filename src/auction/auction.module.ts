import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from '../auction/auction.controller';
import { PrismaService } from '../infrastructure/prisma/prisma.sservice';

@Module({
  providers: [AuctionService, PrismaService],
  controllers: [AuctionController],
  exports: [AuctionService], 
})
export class AuctionModule {}
