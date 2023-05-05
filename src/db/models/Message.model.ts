import {
	Association,
	CreationOptional,
	DataTypes,
	InferCreationAttributes,
	InferAttributes,
	Model,
	NonAttribute,
	Sequelize,
	BelongsToGetAssociationMixin,
	BelongsToSetAssociationMixin,
	BelongsToCreateAssociationMixin,
} from "sequelize";
import { Channel } from "./Channel.model";
import { User } from "./User.model";

export type MessageAssociations = "channel" | "user";

type Attributes = InferAttributes<Message, { omit: MessageAssociations }>;
type CreationAttributes = InferCreationAttributes<
	Message,
	{ omit: MessageAssociations }
>;

export class Message extends Model<Attributes, CreationAttributes> {
	declare id: CreationOptional<number>;
	declare content: string;
	declare isEdited: CreationOptional<boolean>;
	declare editedAt: CreationOptional<Date>;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	// Message belongsTo Channel
	declare channel?: NonAttribute<Channel[]>;
	declare getChannel: BelongsToGetAssociationMixin<Channel>;
	declare setChannel: BelongsToSetAssociationMixin<Channel, number>;
	declare createChannel: BelongsToCreateAssociationMixin<Channel>;

	// Message belongsTo User
	declare user?: NonAttribute<User[]>;
	declare getUser: BelongsToGetAssociationMixin<User>;
	declare setUser: BelongsToSetAssociationMixin<User, number>;
	declare createUser: BelongsToCreateAssociationMixin<User>;

	declare static associations: {
		channel: Association<Message, Channel>;
		user: Association<Message, User>;
	};

	static initModel(sequelize: Sequelize): typeof Message {
		Message.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false,
				},
				content: {
					type: DataTypes.STRING(500),
					allowNull: false,
					validate: {
						len: [1, 500],
					},
				},
				isEdited: {
					type: DataTypes.BOOLEAN,
					defaultValue: false,
				},
				editedAt: {
					type: DataTypes.DATE,
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
				tableName: "messages",
			}
		);

		return Message;
	}
}
