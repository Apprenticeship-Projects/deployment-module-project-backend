import { DataTypes, QueryInterface, Sequelize } from "sequelize";

export default {
	up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
		{
			const table = "messages";
			let key = "";

			key = "user_id";
			await queryInterface.addConstraint(table, {
				fields: [key],
				name: `${table}_${key}_fkey`,
				type: "foreign key",
				references: {
					table: "users",
					field: "id",
				},
				onDelete: "cascade",
				onUpdate: "cascade",
			});

			key = "channel_id";
			await queryInterface.addConstraint(table, {
				fields: [key],
				name: `${table}_${key}_fkey`,
				type: "foreign key",
				references: {
					table: "channels",
					field: "id",
				},
				onDelete: "cascade",
				onUpdate: "cascade",
			});
		}
		{
			const table = "sessions";
			let key = "";

			key = "user_id";
			await queryInterface.addConstraint(table, {
				fields: [key],
				name: `${table}_${key}_fkey`,
				type: "foreign key",
				references: {
					table: "users",
					field: "id",
				},
				onDelete: "cascade",
				onUpdate: "cascade",
			});
		}
		{
			const table = "user_channel";
			let key = "";

			key = "user_id";
			await queryInterface.addConstraint(table, {
				fields: [key],
				name: `${table}_${key}_fkey`,
				type: "foreign key",
				references: {
					table: "users",
					field: "id",
				},
				onDelete: "cascade",
				onUpdate: "cascade",
			});

			key = "channel_id";
			await queryInterface.addConstraint(table, {
				fields: [key],
				name: `${table}_${key}_fkey`,
				type: "foreign key",
				references: {
					table: "channels",
					field: "id",
				},
				onDelete: "cascade",
				onUpdate: "cascade",
			});
		}
	},
	down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
		{
			const table = "messages";
			let key = "";

			key = "user_id";
			await queryInterface.removeConstraint(table, `${table}_${key}_fkey`);

			key = "channel_id";
			await queryInterface.removeConstraint(table, `${table}_${key}_fkey`);
		}
		{
			const table = "sessions";
			let key = "";

			key = "user_id";
			await queryInterface.removeConstraint(table, `${table}_${key}_fkey`);
		}
		{
			const table = "user_channel";
			let key = "";

			key = "user_id";
			await queryInterface.removeConstraint(table, `${table}_${key}_fkey`);

			key = "channel_id";
			await queryInterface.removeConstraint(table, `${table}_${key}_fkey`);
		}
	},
};
