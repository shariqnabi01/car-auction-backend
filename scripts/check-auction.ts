import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const now = new Date();

  const auction = await prisma.auction.findFirst({
    where: {
      status: 'LIVE',
      startTime: { lte: now },
      endTime: { gte: now },
    },
  });

  console.log('Current auction:', auction);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
