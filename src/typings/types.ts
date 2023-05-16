import { Channel } from "../db/models";

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

export interface UserData {
	id: number;
	username: string;
	email: string;
	channels: Channel[];
}
