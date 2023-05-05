import {
	Association,
	BelongsToManyGetAssociationsMixin,
	BelongsToManySetAssociationsMixin,
	BelongsToManyAddAssociationMixin,
	BelongsToManyAddAssociationsMixin,
	BelongsToManyCreateAssociationMixin,
	BelongsToManyRemoveAssociationMixin,
	BelongsToManyRemoveAssociationsMixin,
	BelongsToManyHasAssociationMixin,
	BelongsToManyHasAssociationsMixin,
	BelongsToManyCountAssociationsMixin,
	CreationOptional,
	DataTypes,
	HasManyGetAssociationsMixin,
	HasManySetAssociationsMixin,
	HasManyAddAssociationMixin,
	HasManyAddAssociationsMixin,
	HasManyCreateAssociationMixin,
	HasManyRemoveAssociationMixin,
	HasManyRemoveAssociationsMixin,
	HasManyHasAssociationMixin,
	HasManyHasAssociationsMixin,
	HasManyCountAssociationsMixin,
	InferCreationAttributes,
	InferAttributes,
	Model,
	NonAttribute,
	Sequelize,
} from "sequelize";
import { Channel } from "./Channel.model";
import type { Message } from "./Message.model";
import { Session } from "./Session.model";

export type UserAssociations = "channels" | "messages" | "sessions";

type Attributes = InferAttributes<User, { omit: UserAssociations }>;
type CreationAttributes = InferCreationAttributes<User, { omit: UserAssociations }>;

export class User extends Model<Attributes, CreationAttributes> {
	declare id: CreationOptional<number>;
	declare username: string;
	declare password: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	// User belongsToMany Channel
	declare channels?: NonAttribute<Channel[]>;
	declare getChannels: BelongsToManyGetAssociationsMixin<Channel>;
	declare setChannels: BelongsToManySetAssociationsMixin<Channel, number>;
	declare addChannel: BelongsToManyAddAssociationMixin<Channel, number>;
	declare addChannels: BelongsToManyAddAssociationsMixin<Channel, number>;
	declare createChannel: BelongsToManyCreateAssociationMixin<Channel>;
	declare removeChannel: BelongsToManyRemoveAssociationMixin<Channel, number>;
	declare removeChannels: BelongsToManyRemoveAssociationsMixin<Channel, number>;
	declare hasChannel: BelongsToManyHasAssociationMixin<Channel, number>;
	declare hasChannels: BelongsToManyHasAssociationsMixin<Channel, number>;
	declare countChannels: BelongsToManyCountAssociationsMixin;

	async getAllChannels() {
		const channels = await this.getChannels();
		channels.concat(
			await Channel.findAll({
				where: {
					isGlobal: true,
				},
			})
		);
		return channels;
	}

	// User hasMany Message
	declare messages?: NonAttribute<Message[]>;
	declare getMessages: HasManyGetAssociationsMixin<Message>;
	declare setMessages: HasManySetAssociationsMixin<Message, number>;
	declare addMessage: HasManyAddAssociationMixin<Message, number>;
	declare addMessages: HasManyAddAssociationsMixin<Message, number>;
	declare createMessage: HasManyCreateAssociationMixin<Message>;
	declare removeMessage: HasManyRemoveAssociationMixin<Message, number>;
	declare removeMessages: HasManyRemoveAssociationsMixin<Message, number>;
	declare hasMessage: HasManyHasAssociationMixin<Message, number>;
	declare hasMessages: HasManyHasAssociationsMixin<Message, number>;
	declare countMessages: HasManyCountAssociationsMixin;

	// User hasMany Session
	declare sessions?: NonAttribute<Session[]>;
	declare getSessions: HasManyGetAssociationsMixin<Session>;
	declare setSessions: HasManySetAssociationsMixin<Session, string>;
	declare addSession: HasManyAddAssociationMixin<Session, string>;
	declare addSessions: HasManyAddAssociationsMixin<Session, string>;
	declare createSession: HasManyCreateAssociationMixin<Session>;
	declare removeSession: HasManyRemoveAssociationMixin<Session, string>;
	declare removeSessions: HasManyRemoveAssociationsMixin<Session, string>;
	declare hasSession: HasManyHasAssociationMixin<Session, string>;
	declare hasSessions: HasManyHasAssociationsMixin<Session, string>;
	declare countSessions: HasManyCountAssociationsMixin;

	declare static associations: {
		channels: Association<User, Channel>;
		messages: Association<User, Message>;
		sessions: Association<User, Session>;
	};

	static initModel(sequelize: Sequelize): typeof User {
		User.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false,
				},
				username: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
					validate: {
						len: [2, 40],
					},
				},
				password: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				createdAt: {
					type: DataTypes.DATE,
				},
				updatedAt: {
					type: DataTypes.DATE,
				},
			},
			{
				sequelize,
				tableName: "users",
			}
		);

		return User;
	}
}
