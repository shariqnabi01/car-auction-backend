import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const auction = await prisma.auction.findUnique({
    where: { id: '87daae61-7a1d-40d1-952c-77a4f6553778' },
  });
  console.log('Auction details:', auction);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
