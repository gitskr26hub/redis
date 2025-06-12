import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  'bidding-module-db1',
//   process.env.Azureuser,
  'root',
  'root',
  {
    dialect: "mysql",
    // pool: {
    //   max: 5, // maximum number of connections
    //   min: 0, // allow all connections to be closed
    //   acquire: 30000, // max time (ms) to get connection
    //   idle: 10000, // connection closes after 10s idle
    // },
    host: 'localhost',
    port: 3306,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // You can set this to true if you want strict SSL verification
      },
    },
    logging: false, // Disable logging
  }
);


export default sequelize
