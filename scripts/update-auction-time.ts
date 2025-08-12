import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  const updated = await prisma.auction.update({
    where: { id: '87daae61-7a1d-40d1-952c-77a4f6553778' },
    data: {
      startTime: now,
      endTime: oneHourLater,
      status: 'LIVE',
    },
  });

  console.log('Updated auction time:', updated);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
