import { User as UserModel } from "../db/models";

export {};

declare global {
	// Express type overrides
	namespace Express {
		interface User extends UserModel {}
	}
}

declare module "express-session" {
	interface SessionData {
		passport?: {
			user: number;
		};
	}
}
