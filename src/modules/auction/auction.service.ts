
// import {
//   Injectable,
//   NotFoundException,
//   BadRequestException,
// } from '@nestjs/common';
// import { PrismaService } from '../../infrastructure/prisma/prisma.sservice';

// @Injectable()
// export class AuctionService {
//   findAllAuctions() {
//       throw new Error('Method not implemented.');
//   }
//   constructor(private readonly prisma: PrismaService) {}

//   async findAuctionById(id: string) {
//     const auction = await this.prisma.auction.findUnique({
//       where: { id },
//     });

//     if (!auction) {
//       throw new NotFoundException('Auction not found.');
//     }

//     return auction;
//   }

//   async validateAuctionActive(auctionId: string) {
//     const auction = await this.findAuctionById(auctionId);

//     if (auction.status !== 'LIVE') {
//       throw new BadRequestException('Auction is not active.');
//     }

//     return auction;
//   }

//   async updateCurrentBid(
//   auctionId: string,
//   bidAmount: number,
//   winnerId: string,
//   currentVersion: number,
// ) {
//   try {
//     return await this.prisma.auction.update({
//       where: {
//         id_version: {
//           id: auctionId,
//           version: currentVersion,
//         },
//       },
//       data: {
//         currentBid: bidAmount,
//         winnerId,
//         version: {
//           increment: 1,
//         },
//       },
//     });
//   } catch (err) {
//     throw new BadRequestException('Concurrent update error. Please try again.');
//   }
// }
// }


import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.sservice';

@Injectable()
export class AuctionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetch all auctions.
   */
  async findAllAuctions() {
    return this.prisma.auction.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        winner: true, // Optional: include winner details
      },
    });
  }

  /**
   * Fetch a single auction by ID.
   */
  async findAuctionById(id: string) {
    const auction = await this.prisma.auction.findUnique({
      where: { id },
    });

    if (!auction) {
      throw new NotFoundException('Auction not found.');
    }

    return auction;
  }

  /**
   * Ensure the auction is currently live.
   */
  async validateAuctionActive(auctionId: string) {
    const auction = await this.findAuctionById(auctionId);

    if (auction.status !== 'LIVE') {
      throw new BadRequestException('Auction is not active.');
    }

    return auction;
  }

  /**
   * Update the current bid and winner using optimistic locking.
   */
  async updateCurrentBid(
    auctionId: string,
    bidAmount: number,
    winnerId: string,
    currentVersion: number,
  ) {
    try {
      return await this.prisma.auction.update({
        where: {
          id_version: {
            id: auctionId,
            version: currentVersion,
          },
        },
        data: {
          currentBid: bidAmount,
          winnerId,
          version: {
            increment: 1,
          },
        },
      });
    } catch (err) {
      throw new BadRequestException(
        'Concurrent update error. Please try again.',
      );
    }
  }
}
