// import {
//   Injectable,
//   ConflictException,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { PrismaService } from '../../infrastructure/prisma/prisma.sservice';
// import { CreateUserDto } from './user.entity';

// @Injectable()
// export class UserService {
//   constructor(private readonly prisma: PrismaService) {}

//   async createUser(dto: CreateUserDto) {
//     try {
//       return await this.prisma.user.create({ data: dto });
//     } catch (err: any) {
//   console.error('❌ Prisma Error:', err); // 👈 Add this for debugging

//   if (err.code === 'P2002') {
//     throw new ConflictException('Email or username already exists.');
//   }

//   throw new InternalServerErrorException('Failed to create user.');
// }
//   }

//   async findById(id: string) {
//     return await this.prisma.user.findUnique({ where: { id } });
//   }
// }


// import {
//   Injectable,
//   ConflictException,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { PrismaService } from '../../infrastructure/prisma/prisma.sservice';
// import { CreateUserDto } from './user.entity';

// @Injectable()
// export class UserService {
//   constructor(private readonly prisma: PrismaService) {}

//   async createUser(dto: CreateUserDto) {
//     try {
//       return await this.prisma.user.create({ data: dto });
//     } catch (err: any) {
//       console.error('❌ Prisma Error:', err);

//       if (err.code === 'P2002') {
//         throw new ConflictException('Email or username already exists.');
//       }

//       throw new InternalServerErrorException('Failed to create user.');
//     }
//   }

//   async findById(id: string) {
//     return await this.prisma.user.findUnique({ where: { id } });
//   }

//   async findAllUsers() {
//     return this.prisma.user.findMany({
//       select: {
//         id: true,
//         name: true,
//         email: true,
//       },
//     });
//   }
// }


// src/modules/user/user.service.ts
import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.sservice';
import { CreateUserDto } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    try {
      return await this.prisma.user.create({ data: dto });
    } catch (err: any) {
      if (err.code === 'P2002') {
        throw new ConflictException('Email or username already exists.');
      }
      throw new InternalServerErrorException('Failed to create user.');
    }
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

 async findAllUsers() {
  return this.prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      bids: {
        select: {
          amount: true,
          createdAt: true,
          auction: {
            select: {
              id: true,
              title: true,
              currentBid: true,
              status: true,
            },
          },
        },
      },
    },
  });
}


  /**
   * Fetch users with auctions they have won.
   */
  async findAllUsersWithAuctionsWon() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        auctionsWon: {
          select: {
            id: true,
            title: true,
            currentBid: true,
            status: true,
          },
        },
      },
    });
  }

  /**
   * Fetch users with auctions they have placed bids on.
   */
  async findAllUsersWithBiddedAuctions() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        bids: {
          select: {
            amount: true,
            createdAt: true,
            auction: {
              select: {
                id: true,
                title: true,
                currentBid: true,
                status: true,
              },
            },
          },
        },
      },
    });
  }
}
