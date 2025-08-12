import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';  // import controller

@Module({
  providers: [AuctionService],
  controllers: [AuctionController],  // register controller here
  exports: [AuctionService],
})
export class AuctionModule {}
