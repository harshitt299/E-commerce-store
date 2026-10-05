
import { redisClient } from "../config/redis.js";

// kya redis open h??
const isRedisUp =  ()=>{
  return redisClient?.isOpen ===true;
};


const getOrSetCache = async (key , ttlSeconds, dbFunctioncall)=>{
    try {
        if(isRedisUp()){
            const cache = await redisClient.get(key);
            if(cache){
                return {
                    data : JSON.parse(cache),
                    fromCache : true,
                };
            }
        }
    } catch (error) {
        console.log("Redis Get failed" ,error.message);
    };

    // agr redis se nhi aaya to databse se call
    const data = await dbFunctioncall();

    // databse se data aane ke baad cache me store krna
    try {
        if(isRedisUp()&& data !==undefined){
            await redisClient.setEx(key,ttlSeconds,JSON.stringify(data));
        }
    } catch (error) {
        console.log("Error in Saving Data in cache",error.message)
    }
    return {
        data,
        fromCache : false,
    }
};


const delCache = async(key)=>{
 try {
    if(isRedisUp()){
    await redisClient.del(key);
    }
 } catch (error) {
    console.log("Failed to delete data from Redix", error.message)
 }
};


const delCacheByPattern = async(pattern)=>{
    try {
        if(!isRedisUp()) return;

        const keys = await redisClient.keys(pattern);
        if(keys.length>0){
            await redisClient.del(keys);
        }
    } catch (error) {
        console.log("Error in deleting pattern cache",error.message);
    }
};


export {getOrSetCache,delCache,delCacheByPattern};
