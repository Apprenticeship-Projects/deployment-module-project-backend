import {
	CreationOptional,
	DataTypes,
	InferCreationAttributes,
	InferAttributes,
	Model,
	Sequelize,
	Association,
	NonAttribute,
	BelongsToGetAssociationMixin,
	BelongsToSetAssociationMixin,
	BelongsToCreateAssociationMixin,
} from "sequelize";
import { User } from "./User.model";

export type SessionAssociations = "user";

type Attributes = InferAttributes<Session, { omit: SessionAssociations }>;
type CreationAttributes = InferCreationAttributes<
	Session,
	{ omit: SessionAssociations }
>;

export class Session extends Model<Attributes, CreationAttributes> {
	declare sid: string;
	declare data: string;
	declare expiresAt: Date;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	// Session belongsTo Account
	declare user?: NonAttribute<User>;
	declare getUser: BelongsToGetAssociationMixin<User>;
	declare setUser: BelongsToSetAssociationMixin<User, number>;
	declare createUser: BelongsToCreateAssociationMixin<User>;

	declare static associations: {
		user: Association<Session, User>;
	};

	static initModel(sequelize: Sequelize): typeof Session {
		Session.init(
			{
				sid: {
					type: DataTypes.STRING,
					primaryKey: true,
					allowNull: false,
				},
				data: {
					type: DataTypes.STRING(512),
				},
				expiresAt: {
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
				tableName: "sessions",
			}
		);

		return Session;
	}
}
