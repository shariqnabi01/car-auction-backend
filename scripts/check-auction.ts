import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const auction = await prisma.auction.findUnique({
    where: { id: '459c0cbb-097e-4d34-aa21-9d0cc2fe3fff' },
  });
  console.log('Current auction:', auction);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
