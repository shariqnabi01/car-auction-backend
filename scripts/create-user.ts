// scripts/create-user.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'demo user',
      email: 'devxample.com',
      password: 'secure1234', 
    },
  });

  console.log('✅ Created user:', user);
}

main().catch(console.error).finally(() => prisma.$disconnect());
