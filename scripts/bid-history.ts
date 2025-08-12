import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getBidHistory(auctionId: string) {
  return prisma.bid.findMany({
    where: { auctionId },
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}

async function main() {
  const [auctionId] = process.argv.slice(2);
  if (!auctionId) {
    console.error('Usage: npx ts-node scripts/bid-history.ts <auctionId>');
    process.exit(1);
  }

  try {
    const bids = await getBidHistory(auctionId);
    if (bids.length === 0) {
      console.log('No bids found for this auction.');
      return;
    }

    console.log(`Bid history for auction ${auctionId}:`);
    bids.forEach((bid) => {
      console.log(`- ${bid.user.name} (${bid.user.email}) bid ${bid.amount} at ${bid.createdAt.toISOString()}`);
    });
  } catch (err: any) {
    console.error('Error fetching bid history:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
