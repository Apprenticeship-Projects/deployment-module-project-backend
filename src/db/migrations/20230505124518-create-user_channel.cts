import { DataTypes, QueryInterface, Sequelize } from "sequelize";

export default {
	up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
		await queryInterface.createTable("user_channel", {
			user_id: {
				type: DataTypes.INTEGER,
				field: "user_id",
			},
			channel_id: {
				type: DataTypes.INTEGER,
				field: "channel_id",
			},
		});
	},
	down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
		await queryInterface.dropTable("user_channel");
	},
};
