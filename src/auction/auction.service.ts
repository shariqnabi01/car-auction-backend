// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../infrastructure/prisma/prisma.sservice';

// @Injectable()
// export class AuctionService {
//   findAllAuctions() {
//       throw new Error('Method not implemented.');
//   }
//   constructor(private readonly prisma: PrismaService) {}

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
//       console.log('❌ No auction found for ID:', id);
//       throw new NotFoundException('Auction not found.');
//     }

//     console.log('✅ Auction found:', auction.id);
//     return auction;
//   }

//   // other methods like createAuction(), listAuctions(), etc.
// }


import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../infrastructure/prisma/prisma.sservice';

@Injectable()
export class AuctionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all auctions from the database.
   */
  async findAllAuctions() {
    const auctions = await this.prisma.auction.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return auctions;
  }

  /**
   * Find auction by ID and throw if not found.
   * @param id string
   */
  async findAuctionById(id: string) {
    console.log('🔍 Attempting to find auction with ID:', id);

    const auction = await this.prisma.auction.findUnique({
      where: { id },
    });

    if (!auction) {
      console.log('❌ No auction found for ID:', id);
      throw new NotFoundException('Auction not found.');
    }

    console.log('✅ Auction found:', auction.id);
    return auction;
  }

  // Other methods: createAuction(), updateBid(), etc.
}
