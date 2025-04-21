const { createClient } = require('redis');
const dotenv = require('dotenv');
dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
})

redisClient.on('error', (err) => console.log('Redis client error: ', err))
redisClient.on('connect', () => console.log('Redis client connected'))
redisClient.on('ready', () => console.log('Redis client is ready'))
redisClient.on('end', () => console.log('Redis client disconnected'))

(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to redis successfully');
    } catch (error) {
        console.error('Error connecting to redis: ', error);
    }
})

module.exports = redisClient