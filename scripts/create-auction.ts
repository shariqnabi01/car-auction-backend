import { PrismaClient, AuctionStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const auction = await prisma.auction.create({
    data: {
      title: 'Test Auction',
      status: AuctionStatus.LIVE, 
      startingBid: 1000,          
      currentBid: 1000,
      startTime: new Date(),
      endTime: new Date(Date.now() + 60 * 60 * 1000), // +1 hour
    },
  });

  console.log('✅ Created Auction:', auction);
}

main().catch(console.error).finally(() => prisma.$disconnect());
