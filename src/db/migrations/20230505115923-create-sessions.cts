import { DataTypes, QueryInterface, Sequelize } from "sequelize";

export default {
	up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
		await queryInterface.createTable("sessions", {
			sid: {
				type: DataTypes.STRING,
				field: "sid",
				primaryKey: true,
				allowNull: false,
			},
			data: {
				type: DataTypes.STRING(512),
				field: "data",
			},
			expiresAt: {
				type: DataTypes.DATE,
				field: "expires_at",
			},
			createdAt: {
				type: DataTypes.DATE,
				field: "created_at",
			},
			updatedAt: {
				type: DataTypes.DATE,
				field: "updated_at",
			},
			user_id: {
				type: DataTypes.INTEGER,
				field: "user_id",
			},
		});
	},
	down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
		await queryInterface.dropTable("sessions");
	},
};
