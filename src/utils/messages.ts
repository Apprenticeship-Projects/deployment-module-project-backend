import { Message } from "../db/models";
import { OutgoingMessage } from "../typings/types";

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
			username: user.username,
		},
	};
}
