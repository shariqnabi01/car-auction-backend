import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getWinnerDetails(auctionId: string) {
  return prisma.auction.findUnique({
    where: { id: auctionId },
    include: { winner: { select: { id: true, name: true, email: true } } },
  });
}

async function main() {
  const [auctionId] = process.argv.slice(2);
  if (!auctionId) {
    console.error('Usage: npx ts-node scripts/winner-details.ts <auctionId>');
    process.exit(1);
  }

  try {
    const auction = await getWinnerDetails(auctionId);
    if (!auction) {
      console.log('Auction not found.');
      return;
    }
    if (!auction.winner) {
      console.log('No winner yet for this auction.');
      return;
    }

    console.log(`Winner of auction ${auctionId}:`);
    console.log(`- Name: ${auction.winner.name}`);
    console.log(`- Email: ${auction.winner.email}`);
  } catch (err: any) {
    console.error('Error fetching winner details:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
