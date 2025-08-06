// src/infrastructure/prisma/prisma.module.ts

import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.sservice'

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
