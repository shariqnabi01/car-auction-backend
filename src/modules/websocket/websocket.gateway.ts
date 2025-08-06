import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayDisconnect,
  OnGatewayConnection,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, OnModuleInit, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { BidService } from '../bid/bid.service';
import { RedisPubSubService } from '../../infrastructure/redis/pubsub.service';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard';
import { BidDto, JoinAuctionDto } from '../websocket/websocket.types';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class WebsocketGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit
{
  private readonly logger = new Logger(WebsocketGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly bidService: BidService,
    private readonly redisPubSub: RedisPubSubService,
  ) {}

  /**  Safely subscribe here */
  async onModuleInit() {
    this.logger.log('WebSocket Gateway: onModuleInit');

    await this.redisPubSub.subscribe('bid_updates', (message: string) => {
      try {
        const data = JSON.parse(message);
        this.server.to(data.auctionId).emit('newBid', data);
      } catch (err) {
        this.logger.error('Failed to parse Redis bid update message', err);
      }
    });
  }

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(RateLimitGuard)
  @SubscribeMessage('joinAuction')
  handleJoinAuction(
    @MessageBody() data: JoinAuctionDto,
    @ConnectedSocket() client: Socket,
  ) {
    if (!data.auctionId) {
      client.emit('error', { message: 'auctionId is required' });
      return;
    }

    client.join(data.auctionId);
    this.logger.log(`Client ${client.id} joined auction ${data.auctionId}`);
    client.emit('joinedAuction', { auctionId: data.auctionId });
  }

  @UseGuards(RateLimitGuard)
  @SubscribeMessage('placeBid')
  async handlePlaceBid(
    @MessageBody() bidData: BidDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { userId, auctionId, bidAmount } = bidData;

      const bidResult = await this.bidService.placeBid(userId, auctionId, bidAmount);

      this.logger.log(`New bid placed: ${bidResult.amount} by user ${bidResult.userId}`);
      
      console.log('Received bid payload:', bidData);

      
      // Publish to Redis for other subscribers (across pods or instances)
      this.redisPubSub.publish('bid_updates', JSON.stringify(bidResult));
    } catch (error) {
      this.logger.error('Bid placement failed', error);
      client.emit('error', {
        message: error.message || 'Failed to place bid',
      });
    }
  }
}
