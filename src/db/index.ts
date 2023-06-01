import { Options, Sequelize } from "sequelize";
import * as configs from "./config/config.cjs";
import { initModels } from "./models/index.js";

export let database: Sequelize;

export async function initDatabase() {
	const env = process.env.NODE_ENV || "development";
	const config = (configs as { default: { [key: string]: Options } }).default[env];

	database = new Sequelize({
		...config,
		logging: false,
		define: {
			underscored: true,
		},
	});

	initModels(database);
	await database.sync();

	return database;
}
