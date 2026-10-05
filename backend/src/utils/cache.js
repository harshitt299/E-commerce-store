import { redisClient } from "../config/redis.js";

// Agar Redis down hai to DB se data lao, app crash mat karo
const isRedisUp = () => redisClient?.isOpen === true;

// Cache-Aside helper: pehle Redis dekho, miss hua to DB se lao + Redis me set karo
export const getOrSetCache = async (key, ttlSeconds, dbFallbackFn) => {
    try {
        if (isRedisUp()) {
            const cached = await redisClient.get(key);
            if (cached) return { data: JSON.parse(cached), fromCache: true };
        }
    } catch (err) {
        console.log("Redis GET failed:", err.message);
    }

    const data = await dbFallbackFn();

    try {
        if (isRedisUp() && data !== undefined) {
            await redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
        }
    } catch (err) {
        console.log("Redis SET failed:", err.message);
    }

    return { data, fromCache: false };
};

// Single key delete (update/delete ke baad stale data hatane ke liye)
export const delCache = async (key) => {
    try {
        if (isRedisUp()) await redisClient.del(key);
    } catch (err) {
        console.log("Redis DEL failed:", err.message);
    }
};

// Pattern delete — exp: "products:list:*" saari list pages uda do
// NOTE: node-redis v6 me keys() available hai, production me SCAN use karo
export const delCacheByPattern = async (pattern) => {
    try {
        if (!isRedisUp()) return;
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) await redisClient.del(keys);
    } catch (err) {
        console.log("Redis pattern DEL failed:", err.message);
    }
};
