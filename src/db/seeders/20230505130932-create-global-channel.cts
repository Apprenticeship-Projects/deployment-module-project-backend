import { QueryInterface, Sequelize } from "sequelize";

export default {
	up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
		queryInterface.insert(null, "channels", {
			name: "global",
			is_global: true,
		});
	},
	down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
		queryInterface.delete(null, "channels", {
			name: "global",
		});
	},
};
