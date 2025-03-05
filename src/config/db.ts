// src/config/database.ts
import { Sequelize } from "sequelize";

let configDb;
try {
	configDb = new Sequelize({
		dialect: "mysql",
		host:
			process.env.CONFIG_DB_HOST ||
			"alumni.c50wuqmag6s6.eu-north-1.rds.amazonaws.com", // Host for configuration database
		username: process.env.CONFIG_DB_USERNAME || "root", // Username for configuration database
		password: process.env.CONFIG_DB_PASSWORD || "", // Password for configuration database
		database: process.env.CONFIG_DB_NAME || "alumni-config", // Configuration database name
		port: 24625, // Configuration database name
	});
} catch (error) {
	console.error("Unable to connect to the database:", error);
}
// const configDb = new Sequelize(
//     `mysql://root:Alumni#123456@alumni.c50wuqmag6s6.eu-north-1.rds.amazonaws.com:3306/alumni-config`
// );

// Test the database connection
async function testConfigDatabaseConnection() {
	try {
		await configDb.authenticate();
		console.log(
			"Configuration database connection has been established successfully.",
		);
	} catch (error) {
		console.error(
			"Unable to connect to the configuration database:",
			error,
		);
	}
}

testConfigDatabaseConnection();

export { configDb };

let sequelizeInstance: Sequelize | null = null; // Singleton for the dynamic Sequelize instance

const sequelizeInstanceold = new Sequelize({
	dialect: "mysql",
	// host: 'localhost',
	// username: 'root',
	// password: '',
	// database: 'alumni',
	host: process.env.DB_HOST || "localhost", // Host for configuration database
	username: process.env.DB_USERNAME || "root", // Username for configuration database
	password: process.env.DB_PASSWORD || "", // Password for configuration database
	database: process.env.DB_NAME || "alumni", // Configuration database name
});
// Function to initialize the Sequelize instance dynamically

export async function initializeSequelize(config: {
	host: string;
	username: string;
	password: string;
	database: string;
}) {
	try {
		// Create a new Sequelize instance with the provided config
		console.log("config.database", config.database);
		sequelizeInstance = new Sequelize({
			dialect: "mysql",
			host: config.host,
			username: config.username,
			password: config.password,
			database: config.database,
			port: 16101,
			pool: {
				max: 5,
				min: 0,
				acquire: 30000,
				idle: 10000,
			},
		});
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
}

// Function to retrieve the current Sequelize instance
export function getSequelize(): Sequelize {
	if (!sequelizeInstance) {
		console.log("database connection using old details");
		return sequelizeInstanceold;
	} else {
		console.log("database connection using new details");
		return sequelizeInstance;
	}
}
