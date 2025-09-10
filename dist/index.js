"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const dotenv_1 = require("dotenv");
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("./db"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const redisClient = (0, redis_1.createClient)({
    socket: {
        host: "127.0.0.1", // Redis server host
        port: 6379, // Redis server port
    },
});
redisClient.on("connect", () => {
    console.log("Connected to Redis");
});
redisClient.on("error", (err) => {
    console.log("Redis Client Error", err);
});
(async () => {
    await redisClient.connect();
})();
app.get("/", async (req, res) => {
    try {
        const key = "mykey";
        // const reply = await redisClient.del('mykey');
        //     if (reply === 1) {
        //       console.log(`Key "${key}" deleted successfully.`);
        //     } else {
        //       console.log(`Key "${key}" not found.`);
        //     }
        const value = await redisClient.get(key);
        if (value) {
            console.log("yes value present ");
            return res.send(value);
        }
        const fetchData = await db_1.default.query(`SELECT * FROM product_items limit 50000`, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        //  const key = req.originalUrl || req.url;
        await redisClient.set(key, JSON.stringify(fetchData), {
            EX: 3600, // Cache expiration time in seconds (e.g., 1 hour)
            // NX: true  // Only set the key if it does not already exist
        });
        //  redisClient.destroy();
        // console.log({fetchData})
        res.send(fetchData);
    }
    catch (error) {
        console.error(error);
        res.send(error);
    }
});
app.listen("3000", () => {
    try {
        db_1.default.sync().then(() => {
            console.log(`db connected`);
        });
    }
    catch (error) {
        console.error(error);
    }
    console.log(`server running on http://localhost:3000`);
});
