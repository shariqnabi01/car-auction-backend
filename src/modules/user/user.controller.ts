// // src/modules/user/user.controller.ts

// import { Body, Controller, Post } from '@nestjs/common';
// import { UserService } from './user.service';
// import { CreateUserDto } from './user.entity';

// @Controller('users')
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   @Post()
//   async register(@Body() dto: CreateUserDto) {
//     return this.userService.createUser(dto);
//   }
// }


// import { Body, Controller, Post, Get } from '@nestjs/common';
// import { UserService } from './user.service';
// import { CreateUserDto } from './user.entity';
// import { User } from '@prisma/client'; // Optional: Prisma User type

// @Controller('users')
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   /**
//    * Register a new user
//    * POST /users
//    */
//   @Post()
//   async register(@Body() dto: CreateUserDto): Promise<User> {
//     return this.userService.createUser(dto);
//   }

//   @Get()
// async getAllUsers() {
//   return this.userService.findAllUsers();
// }


//   /**
//    * Get all users
//    * GET /users
//    * Uncomment if needed
//    */
//   // @Get()
//   // async getAllUsers(): Promise<User[]> {
//   //   return this.userService.findAllUsers();
//   // }
// }


// src/modules/user/user.controller.ts
import { Controller, Post, Get, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async register(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Get()
  async getAllUsers() {
    return this.userService.findAllUsers();
  }

  @Get('with-auctions-won')
  async getUsersWithAuctionsWon() {
    return this.userService.findAllUsersWithAuctionsWon();
  }

  @Get('with-bidded-auctions')
  async getUsersWithBiddedAuctions() {
    return this.userService.findAllUsersWithBiddedAuctions();
  }
}
