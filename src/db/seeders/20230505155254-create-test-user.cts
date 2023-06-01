import * as bcrypt from "bcrypt";
import { QueryInterface, Sequelize } from "sequelize";

const SALT_ROUNDS = 10;

export default {
	up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
		await queryInterface.insert(null, "users", {
			username: "TestUser",
			email: "test@email.com",
			password: await bcrypt.hash("testing123", SALT_ROUNDS),
		});
	},
	down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
		await queryInterface.delete(null, "users", {
			email: "test@email.com",
		});
	},
};
