import type { Sequelize } from "sequelize";
import { Channel } from "./Channel.model";
import { Message } from "./Message.model";
import { Session } from "./Session.model";
import { User } from "./User.model";

export { Channel, Message, Session, User };

export function initModels(sequelize: Sequelize) {
	Channel.initModel(sequelize);
	Message.initModel(sequelize);
	Session.initModel(sequelize);
	User.initModel(sequelize);

	// ----- Channel -----

	Channel.belongsToMany(User, {
		as: "users",
		through: "user_channel",
		foreignKey: "channel_id",
		otherKey: "user_id",
		onDelete: "CASCADE",
	});

	// ----- Message -----

	Message.belongsTo(Channel, {
		as: "channel",
		foreignKey: "channel_id",
	});
	Channel.hasMany(Message, {
		as: "messages",
		foreignKey: "channel_id",
	});

	Message.belongsTo(User, {
		as: "user",
		foreignKey: "user_id",
	});
	User.hasMany(Message, {
		as: "messages",
		foreignKey: "user_id",
	});

	// ----- Session -----

	Session.belongsTo(User, {
		as: "user",
		foreignKey: "user_id",
	});
	User.hasMany(Session, {
		as: "sessions",
		foreignKey: "user_id",
	});

	// ----- User -----

	User.belongsToMany(Channel, {
		as: "channels",
		through: "user_channel",
		foreignKey: "user_id",
		otherKey: "channel_id",
		onDelete: "CASCADE",
	});

	return { Channel, Message, Session, User };
}
