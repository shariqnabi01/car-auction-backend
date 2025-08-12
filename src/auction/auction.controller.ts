// import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
// import { AuctionService } from './auction.service';

// @Controller('auctions')
// export class AuctionController {
//   constructor(private readonly auctionService: AuctionService) {}

//   @Get()
//   async getAllAuctions() {
//     return this.auctionService.findAllAuctions(); // REQUIRED
//   }

//   @Get(':id')
//   async getAuctionById(@Param('id') id: string) {
//     try {
//       const auction = await this.auctionService.findAuctionById(id);
//       return auction;
//     } catch (error) {
//       throw new NotFoundException('Auction not found');
//     }
//   }
// }


// import {
//   Controller,
//   Get,
//   Param,
//   NotFoundException,
//   Post,
//   Body,
//   BadRequestException,
// } from '@nestjs/common';
// import { AuctionService } from './auction.service';

// @Controller('auctions')
// export class AuctionController {
//   constructor(private readonly auctionService: AuctionService) {}

//   @Get()
//   async getAllAuctions() {
//     return this.auctionService.findAllAuctions();
//   }

//   @Get(':id')
//   async getAuctionById(@Param('id') id: string) {
//     try {
//       return await this.auctionService.findAuctionById(id);
//     } catch {
//       throw new NotFoundException('Auction not found');
//     }
//   }

//   @Post(':id/bid')
//   async placeBid(
//     @Param('id') auctionId: string,
//     @Body('userId') userId: string,
//     @Body('amount') amount: number,
//   ) {
//     try {
//       return await this.auctionService.placeBid(auctionId, userId, amount);
//     } catch (error: any) {
//       if (error.status && error.response) {
//         // Prisma errors mapped in service as Nest exceptions
//         throw error;
//       }
//       throw new BadRequestException(error.message || 'Failed to place bid');
//     }
//   }

//   @Get(':id/bids')
//   async getBidHistory(@Param('id') auctionId: string) {
//     return this.auctionService.getBidHistory(auctionId);
//   }

//   @Get(':id/winner')
//   async getWinnerDetails(@Param('id') auctionId: string) {
//     return this.auctionService.getWinnerDetails(auctionId);
//   }
// }

// auction.controller.ts
// import {
//   Controller,
//   Get,
//   Param,
//   NotFoundException,
//   Post,
//   Body,
//   BadRequestException,
// } from '@nestjs/common';
// import { AuctionService } from './auction.service';

// @Controller('auctions')
// export class AuctionController {
//   constructor(private readonly auctionService: AuctionService) {}


  
//   @Get()
//   async getAllAuctions() {
//     return this.auctionService.findAllAuctions();
//   }

//   @Get(':id')
//   async getAuctionById(@Param('id') id: string) {
//     try {
//       return await this.auctionService.findAuctionById(id);
//     } catch {
//       throw new NotFoundException('Auction not found');
//     }
//   }

//   @Post(':id/bid')
//   async placeBid(
//     @Param('id') auctionId: string,
//     @Body('userId') userId: string,
//     @Body('amount') amount: number,
//   ) {
//     try {
//       return await this.auctionService.placeBid(auctionId, userId, amount);
//     } catch (error: any) {
//       if (error.status && error.response) {
//         // Prisma errors mapped as Nest exceptions
//         throw error;
//       }
//       throw new BadRequestException(error.message || 'Failed to place bid');
//     }
//   }

//   @Get(':id/bids')
//   async getBidHistory(@Param('id') auctionId: string) {
//     return this.auctionService.getBidHistory(auctionId);
//   }

//   @Get(':id/winner')
//   async getWinnerDetails(@Param('id') auctionId: string) {
//     return this.auctionService.getWinnerDetails(auctionId);
//   }
//   // Add other methods as needed  
//   @Get('test')
// test() {
//   return { message: 'AuctionController is working' };
// }

  
// }

import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Post,
  Body,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './auction.dto';
import { Auction } from '@prisma/client';

@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createAuction(@Body() dto: CreateAuctionDto): Promise<Auction> {
    return this.auctionService.createAuction(dto);
  }

  @Get()
  async getAllAuctions(): Promise<Auction[]> {
    return this.auctionService.findAllAuctions();
  }

  @Get('test')
  test() {
    return { message: 'AuctionController is working' };
  }

  @Get(':id')
  async getAuctionById(@Param('id') id: string): Promise<Auction> {
    try {
      return await this.auctionService.findAuctionById(id);
    } catch {
      throw new NotFoundException('Auction not found');
    }
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
        throw error;
      }
      throw new BadRequestException(error.message || 'Failed to place bid');
    }
  }

  @Get(':id/bids')
  async getBidHistory(@Param('id') auctionId: string): Promise<any> {
    return this.auctionService.getBidHistory(auctionId);
  }

  @Get(':id/winner')
  async getWinnerDetails(@Param('id') auctionId: string): Promise<any> {
    return this.auctionService.getWinnerDetails(auctionId);
  }
}
