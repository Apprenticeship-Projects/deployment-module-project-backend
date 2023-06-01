import { Message, User } from "../db/models";
import { OutgoingMessage, UserData } from "../typings/types";

export async function formatMessage(message: Message): Promise<OutgoingMessage> {
	const user = await message.getUser();
	const channel = await message.getChannel();

	return {
		id: message.id,
		channelId: channel.id,
		content: message.content,
		isEdited: message.isEdited,
		editedAt: message.editedAt,
		createdAt: message.createdAt,
		user: {
			id: user.id,
			username: user.username,
		},
	};
}

export async function formatUser(user: User): Promise<UserData> {
	const channels = await user.getAllChannels();

	return {
		id: user.id,
		username: user.username,
		email: user.email,
		channels: channels,
	};
}
