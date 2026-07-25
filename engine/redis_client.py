import os
import logging
import redis

# Setup logging
logger = logging.getLogger("teammatch_redis")
logger.setLevel(logging.INFO)

REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379/0")

class RedisClient:
    def __init__(self):
        self.client = None
        self.enabled = False
        try:
            # Set socket_connect_timeout=2.0 to fail fast if Redis isn't running
            self.client = redis.Redis.from_url(REDIS_URL, socket_connect_timeout=2.0, decode_responses=True)
            self.client.ping()
            self.enabled = True
            logger.info("Successfully connected to Redis database.")
            print("Successfully connected to Redis database.")
        except Exception as e:
            logger.warning(f"Could not connect to Redis at {REDIS_URL}. Caching is disabled. Error: {e}")
            print(f"WARNING: Could not connect to Redis. Caching is disabled. Error: {e}")
            self.client = None
            self.enabled = False

    def get(self, key):
        if not self.enabled or not self.client:
            return None
        try:
            return self.client.get(key)
        except Exception as e:
            logger.warning(f"Redis get failed for key {key}: {e}")
            return None

    def set(self, key, value, ttl=86400):
        if not self.enabled or not self.client:
            return False
        try:
            self.client.set(key, value, ex=ttl)
            return True
        except Exception as e:
            logger.warning(f"Redis set failed for key {key}: {e}")
            return False

    def clear_pattern(self, pattern):
        if not self.enabled or not self.client:
            return False
        try:
            keys = self.client.keys(pattern)
            if keys:
                self.client.delete(*keys)
                logger.info(f"Cleared cache keys matching pattern: {pattern}")
                print(f"Cleared cache keys matching pattern: {pattern}")
            return True
        except Exception as e:
            logger.warning(f"Redis clear_pattern failed for {pattern}: {e}")
            return False

# Singleton instance
redis_client = RedisClient()
