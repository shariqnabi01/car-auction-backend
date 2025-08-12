// import { Module } from '@nestjs/common';
// import { AuctionService } from './auction.service';
// import { AuctionController } from '../auction/auction.controller';
// import { PrismaService } from '../infrastructure/prisma/prisma.sservice';

// @Module({
//   providers: [AuctionService, PrismaService],
//   controllers: [AuctionController],
//   exports: [AuctionService], 
// })
// export class AuctionModule {}


import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { PrismaService } from '../infrastructure/prisma/prisma.sservice'; // Fix the typo here too


@Module({
  imports: [],  // No AuctionModule here!
  providers: [AuctionService, PrismaService],
  controllers: [AuctionController],
  exports: [AuctionService],
})
export class AuctionModule {}

