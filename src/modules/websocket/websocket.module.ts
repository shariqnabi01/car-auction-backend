// src/modules/websocket/websocket.module.ts
import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { RedisModule } from '../../infrastructure/redis/redis.module'; 
import { BidModule } from '../../modules/bid/bid.module'; 


@Module({
  imports: [RedisModule, BidModule], 
  providers: [WebsocketGateway],
})
export class GatewayModule {}
