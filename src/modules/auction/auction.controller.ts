import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AuctionService } from './auction.service';

@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  // Place fixed routes BEFORE dynamic param routes to avoid route conflicts

  @Get('ping')
  ping() {
    return { message: 'AuctionController is working' };
  }

  @Post(':id/bid')
  async placeBid(
    @Param('id') auctionId: string,
    @Body('userId') userId: string,
    @Body('amount') amount: number,
  ) {
    try {
      return await this.auctionService.placeBid(auctionId, userId, amount);
    } catch (error: any) {
      if (error.status && error.response) {
        throw error; // Already a Nest error, rethrow
      }
      throw new BadRequestException(error.message || 'Failed to place bid');
    }
  }

  @Get(':id/bids')
  async getBidHistory(@Param('id') auctionId: string) {
    return this.auctionService.findBidsByAuctionId(auctionId);
  }

  @Get(':id/winner')
  async getWinner(@Param('id') auctionId: string) {
    return this.auctionService.getWinnerByAuctionId(auctionId);
  }

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
