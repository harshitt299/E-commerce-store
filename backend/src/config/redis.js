import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.log("Redis Client Error:", err));
redisClient.on("connect", () => console.log("Redis connecting..."));
redisClient.on("ready", () => console.log("Redis ready ✅"));

// Connect function — server.js se call hogi
// Agar Redis down hai to app crash nahi hogi, sirf warning dega
// (isOpen check se double-connect error bachta hai)
const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    } catch (err) {
        console.log("Redis connection failed, app MongoDB pe chalegi:", err.message);
    }
};

export { redisClient, connectRedis };
export default redisClient;
