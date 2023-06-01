import { Options } from "sequelize";

const DIALECT = "postgres";
const DEFAULT_DATABASE_NAME = "chatproject";

const config: { [env: string]: Options } = {
	development: {
		database: process.env.DATABASE_NAME || DEFAULT_DATABASE_NAME,
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASS,
		host: process.env.DATABASE_HOST,
		port: 5432,
	},
	test: {
		database: process.env.DATABASE_NAME || DEFAULT_DATABASE_NAME,
		username: process.env.DATABASE_USER || "postgres",
		password: process.env.DATABASE_PASS || "postgres",
		host: process.env.DATABASE_HOST || "localhost",
		port: 5432,
	},
	production: {
		database: process.env.DATABASE_NAME,
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASS,
		host: process.env.DATABASE_HOST || "localhost",
		port: 5432,
	},
};

for (const entry of Object.values(config)) {
	entry.dialect = DIALECT;
	entry.dialectOptions = {
		ssl:
			process.env.DATABASE_SSL === "true"
				? {
						require: true,
						rejectUnauthorized: false,
				  }
				: undefined,
	};
}

module.exports = config;
