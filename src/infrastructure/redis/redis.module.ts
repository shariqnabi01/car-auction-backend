import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisPubSubService } from '../redis/pubsub.service';

@Module({
  providers: [RedisService, RedisPubSubService],
  exports: [RedisService, RedisPubSubService], // <-- ensure RedisPubSubService is exported
})
export class RedisModule {}
