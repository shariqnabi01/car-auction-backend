
import { createClient } from 'redis';

export const redis = createClient({
  url: 'redis://localhost:6379', // adjust if your Redis runs on another host/port
});

redis.on('error', (err) => console.error(' Redis Client Error', err));

(async () => {
  if (!redis.isOpen) {
    await redis.connect();
    console.log(' Redis connected');
  }
})();
