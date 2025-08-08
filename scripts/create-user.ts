// test-create-user.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.create({
      data: {
        name: 'Minimal User',
        email: 'minimal@example.com',
        password: '123456',
      },
    });
    console.log('User created:', user);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
