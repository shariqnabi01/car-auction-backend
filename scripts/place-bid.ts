// scripts/place-bid.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function placeBid(auctionId: string, bidAmount: number) {
  const auction = await prisma.auction.findUnique({ where: { id: auctionId } });

  if (!auction) {
    console.error('❌ Auction not found');
    process.exit(1);
  }

  if (bidAmount <= auction.currentBid) {
    console.error(` Bid must be higher than current bid (${auction.currentBid})`);
    process.exit(1);
  }

  const updated = await prisma.auction.update({
    where: { id: auctionId },
    data: {
      currentBid: bidAmount,
      version: { increment: 1 }, // For optimistic locking if used
    },
  });

  console.log(' Bid placed successfully:', {
    auctionId: updated.id,
    newBid: updated.currentBid,
    version: updated.version,
  });

  process.exit();
}

// Get command line args
const args = process.argv.slice(2);
const [auctionId, bidAmountStr] = args;

if (!auctionId || !bidAmountStr || isNaN(Number(bidAmountStr))) {
  console.error('Usage: npx ts-node scripts/place-bid.ts <auctionId> <bidAmount>');
  process.exit(1);
}

placeBid(auctionId, Number(bidAmountStr));
