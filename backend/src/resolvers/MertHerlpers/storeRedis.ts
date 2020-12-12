import { Redis } from "ioredis";
import { Mert } from "../../entities";

export const storeMertRedis = async (mert: Mert, redis: Redis) => {
  if (mert?.father) {
    await redis.lpush(mert.father.id, JSON.stringify(mert));
  } else {
    await redis.lpush("merts", JSON.stringify(mert));
  }
};
