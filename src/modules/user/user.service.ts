import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.sservice';
import { CreateUserDto } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    try {
      return await this.prisma.user.create({ data: dto });
    } catch (err: any) {
      //Handle unique constraint error
      if (err.code === 'P2002') {
        throw new ConflictException('Email or username already exists.');
      }

      //Catch all other errors
      throw new InternalServerErrorException('Failed to create user.');
    }
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }
}
