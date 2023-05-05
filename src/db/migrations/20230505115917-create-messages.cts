import { DataTypes, QueryInterface, Sequelize } from "sequelize";

export default {
	up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
		await queryInterface.createTable("messages", {
			id: {
				type: DataTypes.INTEGER,
				field: "id",
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			content: {
				type: DataTypes.STRING(500),
				field: "content",
				allowNull: false,
				validate: {
					len: [1, 500],
				},
			},
			isEdited: {
				type: DataTypes.BOOLEAN,
				field: "is_edited",
				defaultValue: false,
			},
			editedAt: {
				type: DataTypes.DATE,
				field: "edited_at",
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
			channel_id: {
				type: DataTypes.INTEGER,
				field: "channel_id",
			},
		});
	},
	down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
		await queryInterface.dropTable("messages");
	},
};
