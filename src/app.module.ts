import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuctionModule } from './modules/auction/auction.module';
import { BidModule } from './modules/bid/bid.module';
import { UserModule } from './modules/user/user.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { RabbitMQModule } from './modules/../infrastructure/rabbitmq/rabbitmq.module';
import { GatewayModule } from './modules/websocket/websocket.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    
    RedisModule,
    RabbitMQModule,
    AuctionModule,
    BidModule,
    UserModule,
    GatewayModule,
  ],
})
export class AppModule {}
