import { io } from 'socket.io-client';
import { createClient } from 'redis';

(async () => {
  // ✅ Setup Redis client
  const redis = createClient();

  redis.on('error', (err) => console.error('❌ Redis error:', err));

  await redis.connect();
  console.log('✅ Redis connected');

  // ✅ Subscribe to Redis pub/sub
  await redis.subscribe('bid_updates', (message) => {
    console.log('📢 Bid Update Received:', message);
  });

  // ✅ Connect to WebSocket server
  const socket = io('http://localhost:3000/bid', {
    transports: ['websocket'],
  });

  const auctionId = '459c0cbb-097e-4d34-aa21-9d0cc2fe3fff';
  const userId = 'd50c491e-ae5a-4ede-9eae-65eed908a345';
  const bidAmount = 1600;

  socket.on('connect', () => {
    console.log('✅ Connected to WebSocket');

    // Join auction room
    socket.emit('join_auction', { auctionId });

    // Place bid after short delay
    setTimeout(() => {
      socket.emit('place_bid', { auctionId, userId, bidAmount });
      console.log(`📨 Sent bid: ₹${bidAmount}`);
    }, 1000);
  });

  socket.on('bid_success', (data) => {
    console.log('✅ Bid placed successfully:', data);
  });

  socket.on('bid_error', (error) => {
    console.error('❌ Bid failed:', error.message);
  });

  // Keep process running
  process.stdin.resume();
})();
