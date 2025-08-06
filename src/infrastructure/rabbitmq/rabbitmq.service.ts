import { Injectable, OnModuleInit } from '@nestjs/common';
import { Channel, Connection } from 'amqplib/lib/channel';
import { connect } from 'amqplib';


@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection!: Connection;
  private channel!: Channel;

  async onModuleInit() {
    const rabbitmqUrl = process.env.RABBITMQ_URL;
    if (!rabbitmqUrl) {
      throw new Error('RABBITMQ_URL is not defined in environment variables');
    }

    // ✅ connect using promise-based connect
    this.connection = await connect(rabbitmqUrl);
    this.channel = await this.connection.createChannel();

    await this.assertQueues();
    console.log('✅ RabbitMQ connected');
  }

  private async assertQueues() {
    const queues = [
      process.env.RABBITMQ_BID_QUEUE,
      process.env.RABBITMQ_NOTIFICATION_QUEUE,
      process.env.RABBITMQ_AUDIT_QUEUE,
      process.env.RABBITMQ_DLQ,
    ];

    for (const queue of queues) {
      if (!queue) {
        throw new Error('One or more RabbitMQ queue names are undefined in .env');
      }
      await this.channel.assertQueue(queue, { durable: true });
    }
  }

  async publish(queue: string, message: object) {
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
  }

  async consume(queue: string, callback: (msg: any) => void) {
    await this.channel.consume(queue, (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          callback(content);
          this.channel.ack(msg);
        } catch (error) {
          console.error(`❌ Error handling message on ${queue}`, error);
          this.channel.nack(msg, false, false);
        }
      }
    });
  }

  getChannel(): Channel {
    return this.channel;
  }
}
