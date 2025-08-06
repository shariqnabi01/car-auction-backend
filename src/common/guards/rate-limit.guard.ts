// src/common/guards/rate-limit.guard.ts

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { Socket } from 'socket.io';

const RATE_LIMIT = parseInt(process.env.MAX_BID_PER_MINUTE || '10');
const WINDOW_MS = 60 * 1000;

const bidTracker: Record<string, { count: number; windowStart: number }> = {};

@Injectable()
export class RateLimitGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const ip = client.handshake.address;

    const now = Date.now();

    if (!bidTracker[ip]) {
      bidTracker[ip] = { count: 1, windowStart: now };
      return true;
    }

    const timePassed = now - bidTracker[ip].windowStart;

    if (timePassed > WINDOW_MS) {
      bidTracker[ip] = { count: 1, windowStart: now };
      return true;
    }

    if (bidTracker[ip].count >= RATE_LIMIT) {
      throw new BadRequestException('Too many bids. Please wait a moment.');
    }

    bidTracker[ip].count += 1;
    return true;
  }
}
