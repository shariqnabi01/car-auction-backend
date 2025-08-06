import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { AuctionService } from './auction.service';

@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get()
  async listAll() {
    return this.auctionService.findAllAuctions();
  }

  @Get(':id')
  async getAuctionById(@Param('id') id: string) {
    try {
      return await this.auctionService.findAuctionById(id);
    } catch {
      throw new NotFoundException('Auction not found');
    }
  }
}
