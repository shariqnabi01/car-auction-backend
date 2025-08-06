import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisPubSubService implements OnModuleInit {
  private pub: Redis;
  private sub: Redis;

  onModuleInit() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    this.pub = new Redis(redisUrl);
    this.sub = new Redis(redisUrl);

    this.sub.on('message', (channel, message) => {
      console.log(`Channel: ${channel} | Message: ${message}`);
    });
  }

  publish(channel: string, message: string) {
    if (!this.pub) throw new Error('Redis publisher not initialized');
    this.pub.publish(channel, message);
  }

  subscribe(channel: string, callback: (message: string) => void) {
    if (!this.sub) throw new Error('Redis subscriber not initialized');
    this.sub.subscribe(channel);
    this.sub.on('message', (chan, msg) => {
      if (chan === channel) callback(msg);
    });
  }
}
