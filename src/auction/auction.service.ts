
// @Injectable()
// export class AuctionService {
//   constructor(private readonly prisma: PrismaService) {}

//   /**
//    * Get all auctions from the database.
//    */
//   async findAllAuctions() {
//     const auctions = await this.prisma.auction.findMany({
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });

//     return auctions;
//   }

//   /**
//    * Find auction by ID and throw if not found.
//    * @param id string
//    */
//   async findAuctionById(id: string) {
//     console.log('🔍 Attempting to find auction with ID:', id);

//     const auction = await this.prisma.auction.findUnique({
//       where: { id },
//     });

//     if (!auction) {
//       console.log('No auction found for ID:', id);
//       throw new NotFoundException('Auction not found.');
//     }

//     console.log(' Auction found:', auction.id);
//     return auction;
//   }

//   // Other methods: createAuction(), updateBid(), etc.
// }




// @Injectable()
// export class AuctionService {
//   constructor(private readonly prisma: PrismaService) {}


  
//   /** Get all auctions ordered by creation date descending */
//   async findAllAuctions() {
//     return this.prisma.auction.findMany({
//       orderBy: { createdAt: 'desc' },
//     });
//   }

//   /** Find auction by ID or throw NotFoundException */
//   async findAuctionById(id: string) {
//     const auction = await this.prisma.auction.findUnique({ where: { id } });
//     if (!auction) throw new NotFoundException('Auction not found.');
//     return auction;
//   }

//   /**
//    * Place a bid on an auction.
//    * Validates auction status and bid amount.
//    * Creates Bid record and updates auction winner/currentBid.
//    */
//   async placeBid(auctionId: string, userId: string, amount: number) {
//     const auction = await this.prisma.auction.findUnique({ where: { id: auctionId } });
//     if (!auction) throw new NotFoundException('Auction not found.');
//     if (auction.status !== 'LIVE') throw new BadRequestException('Auction is not live.');
//     if (amount <= auction.currentBid) {
//       throw new BadRequestException(`Bid must be higher than current bid (${auction.currentBid}).`);
//     }

//     // Create bid with amount as number (integer), matching DB type
//     const bid = await this.prisma.bid.create({
//       data: {
//         auctionId,
//         userId,
//         amount,  // use number directly, not string
//       },
//     });

//     // Update auction with new highest bid
//     await this.prisma.auction.update({
//       where: { id: auctionId },
//       data: {
//         currentBid: amount,
//         winnerId: userId,
//         version: { increment: 1 },
//       },
//     });

//     return bid;
//   }

//   /**
//    * Get all bids for an auction ordered by newest first,
//    * including user details for each bid.
//    */
//   async getBidHistory(auctionId: string) {
//     return this.prisma.bid.findMany({
//       where: { auctionId },
//       orderBy: { createdAt: 'desc' },
//       include: { user: { select: { id: true, name: true, email: true } } },
//     });
//   }

//   /**
//    * Get current winner details of an auction,
//    * includes user info or null if no winner yet.
//    */
//   async getWinnerDetails(auctionId: string) {
//     const auction = await this.prisma.auction.findUnique({
//       where: { id: auctionId },
//       include: { winner: { select: { id: true, name: true, email: true } } },
//     });

//     if (!auction) throw new NotFoundException('Auction not found.');

//     return auction.winner || null;
//   }
  
// }


import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../infrastructure/prisma/prisma.sservice';
import { CreateAuctionDto } from './auction.dto';
import { Auction } from '@prisma/client';

@Injectable()
export class AuctionService {
  constructor(private readonly prisma: PrismaService) {}

  async createAuction(dto: CreateAuctionDto): Promise<Auction> {
    return this.prisma.auction.create({
      data: {
        title: dto.title,
        startingBid: dto.startingBid,
        currentBid: dto.startingBid,
        startTime: dto.startTime ? new Date(dto.startTime) : null,
        endTime: dto.endTime ? new Date(dto.endTime) : null,
        status: 'PENDING',
      },
    });
  }

  async findAllAuctions(): Promise<Auction[]> {
    return this.prisma.auction.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAuctionById(id: string): Promise<Auction> {
    const auction = await this.prisma.auction.findUnique({ where: { id } });
    if (!auction) throw new NotFoundException('Auction not found.');
    return auction;
  }

  async placeBid(auctionId: string, userId: string, amount: number) {
    const auction = await this.prisma.auction.findUnique({ where: { id: auctionId } });
    if (!auction) throw new NotFoundException('Auction not found.');
    if (auction.status !== 'LIVE') throw new BadRequestException('Auction is not live.');
    if (amount <= auction.currentBid) {
      throw new BadRequestException(`Bid must be higher than current bid (${auction.currentBid}).`);
    }

    const bid = await this.prisma.bid.create({
      data: { auctionId, userId, amount },
    });

    await this.prisma.auction.update({
      where: { id: auctionId },
      data: {
        currentBid: amount,
        winnerId: userId,
        version: { increment: 1 },
      },
    });

    return bid;
  }

  async getBidHistory(auctionId: string) {
    return this.prisma.bid.findMany({
      where: { auctionId },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async getWinnerDetails(auctionId: string) {
    const auction = await this.prisma.auction.findUnique({
      where: { id: auctionId },
      include: { winner: { select: { id: true, name: true, email: true } } },
    });
    if (!auction) throw new NotFoundException('Auction not found.');
    return auction.winner || null;
  }
}
