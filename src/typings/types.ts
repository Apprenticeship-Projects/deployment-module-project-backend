export interface IncomingMessage {
	channelId: number;
	content: string;
}

export interface IncomingMessageUpdate {
	id: number;
	content: string;
}

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
