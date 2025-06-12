import express from "express";
import redis from "redis";
import { config } from "dotenv";
import sequelize from "./db.js";
import { QueryTypes } from "sequelize";



config();
const app = express();
app.use(express.json());

const redisClient = redis.createClient({
    socket: {
        host: '127.0.0.1', // Redis server host
        port: 6379,         // Redis server port
    }
});
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});
redisClient.on('error', err => {
    console.log('Redis Client Error', err);
});
(async () => {
    await redisClient.connect();
})();

app.get("/",async(req,res)=>{
try {

    const key='mykey'
// const reply = await redisClient.del('mykey');
//     if (reply === 1) {
//       console.log(`Key "${key}" deleted successfully.`);
//     } else {
//       console.log(`Key "${key}" not found.`);
//     }
   

    const value=await redisClient.get(key);
    if(value){
        console.log("yes value present ")
        return res.send(value)
    }
    
    
const fetchData=await sequelize.query(`SELECT * FROM product_items limit 50000`,{
    type: QueryTypes.SELECT,
    
});



//  const key = req.originalUrl || req.url;

        await redisClient.set(key, JSON.stringify(fetchData), {
            EX: 3600, // Cache expiration time in seconds (e.g., 1 hour)
            // NX: true  // Only set the key if it does not already exist
        });

//  redisClient.destroy();





// console.log({fetchData})

res.send(fetchData)

} catch (error) {
    console.error(error)
    res.send(error)
}
})






app.listen("3000",  () => {
  try {
     sequelize.sync().then(() => {
      console.log(`db connected`);
    });
  } catch (error) {
    console.error(error);
  }

  console.log(`server running on http://localhost:3000`);
});
