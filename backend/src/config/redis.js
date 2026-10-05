import {createClient} from "redis";


const redisClient = createClient({
    url : process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error" ,(error)=> console.log("RedisClient error" ,error.message));
redisClient.on("connect", ()=>console.log("Redis connecting.."));
redisClient.on("ready", ()=>console.log("Redis ready.."));


const connectRedis = async()=>{
    try {
        if(!redisClient.isOpen){
            await redisClient.connect();
        }
    } catch (error) {
        console.log("Redis connection failed",error.message)
    }
}
export {redisClient,connectRedis};