import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { AuctionService } from './auction.service';

@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get()
  async getAllAuctions() {
    return this.auctionService.findAllAuctions(); // REQUIRED
  }

  @Get(':id')
  async getAuctionById(@Param('id') id: string) {
    try {
      const auction = await this.auctionService.findAuctionById(id);
      return auction;
    } catch (error) {
      throw new NotFoundException('Auction not found');
    }
  }
}
