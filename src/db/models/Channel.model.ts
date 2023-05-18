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
import { Message } from "./Message.model";
import { User } from "./User.model";

export type ChannelAssociations = "users" | "messages";

type Attributes = InferAttributes<Channel, { omit: ChannelAssociations }>;
type CreationAttributes = InferCreationAttributes<
	Channel,
	{ omit: ChannelAssociations }
>;

export class Channel extends Model<Attributes, CreationAttributes> {
	declare id: CreationOptional<number>;
	declare name: string;
	declare isGlobal: boolean;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	// Channel belongsToMany User
	declare users?: NonAttribute<User[]>;
	declare getUsers: BelongsToManyGetAssociationsMixin<User>;
	declare setUsers: BelongsToManySetAssociationsMixin<User, number>;
	declare addUser: BelongsToManyAddAssociationMixin<User, number>;
	declare addUsers: BelongsToManyAddAssociationsMixin<User, number>;
	declare createUser: BelongsToManyCreateAssociationMixin<User>;
	declare removeUser: BelongsToManyRemoveAssociationMixin<User, number>;
	declare removeUsers: BelongsToManyRemoveAssociationsMixin<User, number>;
	declare hasUser: BelongsToManyHasAssociationMixin<User, number>;
	declare hasUsers: BelongsToManyHasAssociationsMixin<User, number>;
	declare countUsers: BelongsToManyCountAssociationsMixin;

	async getAllUsers() {
		if (this.isGlobal) {
			return await User.findAll();
		}
		return await this.getUsers();
	}

	// Channel hasMany Message
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

	declare static associations: {
		users: Association<Channel, User>;
		messages: Association<Channel, Message>;
	};

	static initModel(sequelize: Sequelize): typeof Channel {
		Channel.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false,
				},
				name: {
					type: DataTypes.STRING,
					allowNull: false,
					validate: {
						len: [5, 64],
					},
				},
				isGlobal: {
					type: DataTypes.BOOLEAN,
					allowNull: false,
					defaultValue: false,
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
				tableName: "channels",
			}
		);

		return Channel;
	}
}
