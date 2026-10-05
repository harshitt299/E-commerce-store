import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../config/redis.js";

// Common store — saare server pe ek hi counter (multi-instance me bhi kaam karega)
const store = (prefix) =>
    new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
        prefix,
    });

// Login brute-force rokne ke liye: 15 min me 10 try per IP
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    store: store("rl:login:"),
    message: { success: false, message: "Bahut zyada login try, 15 min baad try karo" },
});

// Register spam rokne ke liye: 1 hour me 5 account per IP
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    store: store("rl:register:"),
    message: { success: false, message: "Bahut zyada register try, 1 hour baad try karo" },
});

// Forgot-password email spam rokne ke liye: 1 hour me 3 mail per IP
export const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    store: store("rl:forgot:"),
    message: { success: false, message: "Bahut zyada reset request, 1 hour baad try karo" },
});
