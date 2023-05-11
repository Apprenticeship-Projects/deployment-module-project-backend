export interface IncomingMessage {
	channelId: number;
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
