import { DataTypes, QueryInterface, Sequelize } from "sequelize";

export default {
	up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
		await queryInterface.createTable("channels", {
			id: {
				type: DataTypes.INTEGER,
				field: "id",
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				field: "name",
				allowNull: false,
				validate: {
					len: [5, 64],
				},
			},
			isGlobal: {
				type: DataTypes.BOOLEAN,
				field: "is_global",
				allowNull: false,
			},
			createdAt: {
				type: DataTypes.DATE,
				field: "created_at",
			},
			updatedAt: {
				type: DataTypes.DATE,
				field: "updated_at",
			},
		});
	},
	down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
		await queryInterface.dropTable("channels");
	},
};
