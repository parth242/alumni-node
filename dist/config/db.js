"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSequelize = exports.initializeSequelize = exports.configDb = void 0;
// src/config/database.ts
const sequelize_1 = require("sequelize");
let configDb;
try {
    exports.configDb = configDb = new sequelize_1.Sequelize({
        dialect: 'mysql',
        host: process.env.CONFIG_DB_HOST || 'alumni.c50wuqmag6s6.eu-north-1.rds.amazonaws.com',
        username: process.env.CONFIG_DB_USERNAME || 'root',
        password: process.env.CONFIG_DB_PASSWORD || 'Alumni#123456',
        database: process.env.CONFIG_DB_NAME || 'alumni-config',
        port: 3306, // Configuration database name
    });
}
catch (error) {
    console.error("Unable to connect to the database:", error);
}
// const configDb = new Sequelize(
//     `mysql://root:Alumni#123456@alumni.c50wuqmag6s6.eu-north-1.rds.amazonaws.com:3306/alumni-config`
// );
// Test the database connection
async function testConfigDatabaseConnection() {
    try {
        await configDb.authenticate();
        console.log('Configuration database connection has been established successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the configuration database:', error);
    }
}
testConfigDatabaseConnection();
let sequelizeInstance = null; // Singleton for the dynamic Sequelize instance
const sequelizeInstanceold = new sequelize_1.Sequelize({
    dialect: 'mysql',
    // host: 'localhost',  
    // username: 'root',
    // password: '',
    // database: 'alumni',
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'alumni', // Configuration database name
});
// Function to initialize the Sequelize instance dynamically
async function initializeSequelize(config) {
    try {
        // Create a new Sequelize instance with the provided config
        console.log('config.database', config.database);
        sequelizeInstance = new sequelize_1.Sequelize({
            dialect: 'mysql',
            host: config.host,
            username: config.username,
            password: config.password,
            database: config.database,
            port: 3306,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
        });
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}
exports.initializeSequelize = initializeSequelize;
// Function to retrieve the current Sequelize instance
function getSequelize() {
    if (!sequelizeInstance) {
        console.log('database connection using old details');
        return sequelizeInstanceold;
    }
    else {
        console.log('database connection using new details');
        return sequelizeInstance;
    }
}
exports.getSequelize = getSequelize;
//# sourceMappingURL=db.js.map