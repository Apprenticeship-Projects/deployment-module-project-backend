import { DataTypes, QueryInterface, Sequelize } from "sequelize";

export default {
	up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
		await queryInterface.createTable("users", {
			id: {
				type: DataTypes.INTEGER,
				field: "id",
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			username: {
				type: DataTypes.STRING,
				field: "username",
				allowNull: false,
				validate: {
					len: [2, 40],
				},
			},
			email: {
				type: DataTypes.STRING,
				field: "email",
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				field: "password",
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
		await queryInterface.dropTable("users");
	},
};
