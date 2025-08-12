import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function placeBid(auctionId: string, userId: string, amount: number) {
  const auction = await prisma.auction.findUnique({ where: { id: auctionId } });
  if (!auction) throw new Error('Auction not found');
  if (auction.status !== 'LIVE') throw new Error('Auction is not live');
  if (amount <= auction.currentBid) {
    throw new Error(`Bid must be higher than current bid (${auction.currentBid})`);
  }

  const bid = await prisma.bid.create({
    data: {
      auctionId,
      userId,
      amount,  // directly number here
    },
  });

  await prisma.auction.update({
    where: { id: auctionId },
    data: {
      currentBid: amount,
      winnerId: userId,
      version: { increment: 1 },
    },
  });

  return bid;
}

async function main() {
  const [auctionId, userId, amountStr] = process.argv.slice(2);
  if (!auctionId || !userId || !amountStr) {
    console.error('Usage: npx ts-node scripts/place-bid.ts <auctionId> <userId> <amount>');
    process.exit(1);
  }

  const amount = Number(amountStr);
  if (isNaN(amount)) {
    console.error('Invalid amount. Must be a number.');
    process.exit(1);
  }

  try {
    const bid = await placeBid(auctionId, userId, amount);
    console.log('Bid placed successfully:', bid);
  } catch (err: any) {
    console.error('Error placing bid:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
