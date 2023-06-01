import dotenv from "dotenv";

// load in environment variables from .env
dotenv.config();

// load in local overrides
dotenv.config({
	path: ".env.local",
	override: true,
});

if (process.env.NODE_ENV) {
	const ENV_PATH = `.env.${process.env.NODE_ENV}`;

	// load in environment variables from env specific files
	dotenv.config({
		path: ENV_PATH,
		override: true,
	});
	// load in environment specific local overrides
	dotenv.config({
		path: `${ENV_PATH}.local`,
		override: true,
	});
}
