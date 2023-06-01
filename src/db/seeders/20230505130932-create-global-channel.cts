import { QueryInterface, Sequelize } from "sequelize";

export default {
	up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
		await queryInterface.insert(null, "channels", {
			name: "global",
			is_global: true,
		});
	},
	down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
		await queryInterface.delete(null, "channels", {
			name: "global",
		});
	},
};
