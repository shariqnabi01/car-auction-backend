// import {
//   Injectable,
//   NotFoundException,
//   BadRequestException,
// } from '@nestjs/common';
// import { PrismaService } from '../../infrastructure/prisma/prisma.sservice';

// @Injectable()
// export class AuctionService {
//   placeBid(auctionId: string, userId: string, amount: number) {
//     throw new Error('Method not implemented.');
//   }
//   constructor(private readonly prisma: PrismaService) {}

//   /**
//    * Fetch all auctions.
//    */
//   async findAllAuctions() {
//     return this.prisma.auction.findMany({
//       orderBy: {
//         createdAt: 'desc',
//       },
//       include: {
//         winner: true, // Optional: include winner details
//       },
//     });
//   }

//   /**
//    * Fetch a single auction by ID.
//    */
//   async findAuctionById(id: string) {
//     const auction = await this.prisma.auction.findUnique({
//       where: { id },
//     });

//     if (!auction) {
//       throw new NotFoundException('Auction not found.');
//     }

//     return auction;
//   }

//   /**
//    * Ensure the auction is currently live.
//    */
//   async validateAuctionActive(auctionId: string) {
//     const auction = await this.findAuctionById(auctionId);

//     if (auction.status !== 'LIVE') {
//       throw new BadRequestException('Auction is not active.');
//     }

//     return auction;
//   }

//   /**
//    * Update the current bid and winner using optimistic locking.
//    */
//   async updateCurrentBid(
//     auctionId: string,
//     bidAmount: number,
//     winnerId: string,
//     currentVersion: number,
//   ) {
//     try {
//       return await this.prisma.auction.update({
//         where: {
//           id_version: {
//             id: auctionId,
//             version: currentVersion,
//           },
//         },
//         data: {
//           currentBid: bidAmount,
//           winnerId,
//           version: {
//             increment: 1,
//           },
//         },
//       });
//     } catch (err) {
//       throw new BadRequestException(
//         'Concurrent update error. Please try again.',
//       );
//     }
//   }
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
   * Place a bid on an auction with optimistic locking.
   */
  async placeBid(auctionId: string, userId: string, amount: number) {
    // Validate auction exists and is live
    const auction = await this.validateAuctionActive(auctionId);

    // Check bid amount is greater than current highest bid
    if (amount <= auction.currentBid) {
      throw new BadRequestException(
        `Bid amount must be higher than current bid (${auction.currentBid})`,
      );
    }

    // Create the bid record
    const bid = await this.prisma.bid.create({
      data: {
        auctionId,
        userId,
        amount,
      },
    });

    // Update auction with new highest bid and winner using optimistic locking
    await this.updateCurrentBid(
      auctionId,
      amount,
      userId,
      auction.version,
    );

    return bid;
  }

  /**
   * Fetch all auctions.
   */
  async findAllAuctions() {
    return this.prisma.auction.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        winner: true,
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

  /**
   * Fetch bids for a given auction.
   */
  async findBidsByAuctionId(auctionId: string) {
    return this.prisma.bid.findMany({
      where: { auctionId },
      orderBy: { createdAt: 'desc' },
      include: { user: true }, // Include user info if available
    });
  }

//   /**
//    * Get winner details of an auction.
//    */
//   async getWinnerByAuctionId(auctionId: string) {
//   const auction = await this.prisma.auction.findUnique({
//     where: { id: auctionId },
//     include: { winner: true },
//   });

//   if (!auction) {
//     throw new NotFoundException('Auction not found');
//   }

//   if (!auction.winner || auction.currentBid <= 0) {
//     return null;
//   }

//   return auction.winner;
// }

// }
async getWinnerByAuctionId(auctionId: string) {
  // Find the highest bid for the auction, including user details
  const highestBid = await this.prisma.bid.findFirst({
    where: { auctionId },
    orderBy: { amount: 'desc' },
    include: { user: true },
  });

  if (!highestBid) {
    // No bids placed yet or auction doesn't exist
    return null;
  }

  return highestBid.user; // Return the user who placed the highest bid
}
}
