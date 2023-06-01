import { Attributes, Model } from "sequelize";
import { Col, Fn, Literal } from "sequelize/types/utils";
import { Channel } from "../db/models";

export interface OutgoingMessage {
	id: number;
	channelId: number;
	content: string;
	isEdited: boolean;
	editedAt: Date;
	createdAt: Date;
	user: {
		id: number;
		username: string;
	};
}

export interface UserConnection {
	id: number;
	channelId: number;
	username: string;
	action: "joined" | "left";
}

export interface UserData {
	id: number;
	username: string;
	email: string;
	channels: Channel[];
}

export type UpdateAttributes<M extends Model> = {
	[key in keyof Attributes<M>]?: Attributes<M>[key] | Fn | Col | Literal;
};
