import { Attributes, Model } from "sequelize";
import { Col, Fn, Literal } from "sequelize/types/utils";

export interface OutgoingMessage {
	id: number;
	channelId: number;
	content: string;
	isEdited: boolean;
	editedAt: Date;
	createdAt: Date;
	user: {
		username: string;
	};
}

export interface UserConnection {
	id: number;
	channelId: number;
	username: string;
	action: "joined" | "left";
}

export type UpdateAttributes<M extends Model> = {
	[key in keyof Attributes<M>]?: Attributes<M>[key] | Fn | Col | Literal;
};
