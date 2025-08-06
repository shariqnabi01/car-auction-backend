import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listAuctions() {
  const auctions = await prisma.auction.findMany();
  console.log('📦 Existing Auctions:');
  auctions.forEach(a => {
    console.log(` ${a.id} | ${a.title} | Current bid: ${a.currentBid}`);

  });
  process.exit();
}

listAuctions();
