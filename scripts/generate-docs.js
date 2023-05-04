import fs from "fs";
import dotenv from "dotenv";
import autogen from "swagger-autogen";

if (!fs.existsSync("dist")) {
	throw new Error(
		"/dist folder does not exist! Compile the project before generating docs."
	);
}

dotenv.config();
dotenv.config({
	path: ".env.local",
	override: true,
});

if (process.env.NODE_ENV) {
	dotenv.config({
		path: `.env.${process.env.NODE_ENV}.local`,
		override: true,
	});
}

const schemes = ["http"];

const doc = {
	info: {
		version: process.env.npm_package_version,
		title: "API",
		description: " API Description",
	},
	host: `localhost:${process.env.PORT}`,
	basePath: "/",
	schemes: schemes,
	consumes: ["application/json"],
	produces: ["application/json"],
	tags: [
		// Add tags here
	],
};

const endpointFiles = ["dist/app.js"];
const generator = autogen({});

generator("dist/swagger.json", endpointFiles, doc);
