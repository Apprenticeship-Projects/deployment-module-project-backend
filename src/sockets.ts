import { Server, Socket } from "socket.io";
import server from "./app";
import { sessionMiddleware } from "./sessions";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { ExtendedError } from "socket.io/dist/namespace";
import passport from "passport";
import { Channel, Message } from "./db/models";
import { database } from "./db";
import {
	IncomingMessage,
	IncomingMessageUpdate,
	OutgoingMessage,
	UserConnection,
} from "./typings/types";
import { formatMessage } from "./utils/messages";

interface ServerToClientEvents {
	messageSent: (data: OutgoingMessage) => void;
	messageEditted: (data: OutgoingMessage) => void;
	userJoinedChannel: (data: UserConnection) => void;
	userLeftChannel: (data: UserConnection) => void;
}

interface ClientToServerEvents {
	sendMessage: (
		data: IncomingMessage,
		callback: (success: boolean, error?: string) => void
	) => void;
	editMessage: (
		data: IncomingMessageUpdate,
		callback: (success: boolean, error?: string) => void
	) => void;
	addChannelUser: (
		userId: number,
		channelId: number,
		callback: (success: boolean, error?: string) => void
	) => void;
	leaveChannel: (
		id: number,
		callback: (success: boolean, error?: string) => void
	) => void;
}

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
	cors: {
		origin: "http://localhost:3000",
	},
});

const useWrapper =
	(handler: RequestHandler) =>
	(socket: Socket, next: (err?: ExtendedError | undefined) => void) =>
		handler(socket.request as Request, {} as Response, next as NextFunction);

io.use(useWrapper(sessionMiddleware));
io.use(useWrapper(passport.initialize()));
io.use(useWrapper(passport.session()));

io.on("connection", async (socket) => {
	const req = socket.request as Request;

	console.log("User connected");
	console.log("Authenticated:", req.isAuthenticated());
	console.log("User:", req.user);

	socket.join(req.session.id);

	if (req.isAuthenticated()) {
		const channels = await req.user.getAllChannels();
		const rooms = [];
		for (const channel of channels) {
			rooms.push(`channel-${channel.id}`);
		}

		socket.join(rooms);

		socket.on("sendMessage", async (data, callback) => {
			const channel = await Channel.findByPk(data.channelId);
			if (!channel) {
				return callback(false, "No such channel");
			}
			if (
				(
					await req.user.getChannels({
						where: {
							id: channel.id,
						},
					})
				).length === 0
			) {
				return callback(false, "Not in channel");
			}

			const transaction = await database!.transaction();

			try {
				const message = await channel.createMessage(
					{
						content: data.content,
					},
					{ transaction }
				);
				await message.setUser(req.user, { transaction });

				await transaction.commit();

				io.to(`channel-${channel.id}`).emit(
					"messageSent",
					await formatMessage(message)
				);
				callback(true);
			} catch (err) {
				await transaction.rollback();

				return callback(false, "Failed to create message");
			}
		});

		socket.on("editMessage", async (data, callback) => {
			const message = await Message.findByPk(data.id);
			if (!message) {
				return callback(false, "No such message");
			}
			if ((await message.getUser()).id !== req.user.id) {
				return callback(false, "Not your message");
			}

			const transaction = await database!.transaction();

			try {
				await message.update(
					{
						content: data.content,
						isEdited: true,
						editedAt: new Date(),
					},
					{ transaction }
				);

				const channel = await message.getChannel({
					transaction,
				});

				await transaction.commit();

				io.to(`channel-${channel.id}`).emit(
					"messageEditted",
					await formatMessage(message)
				);
				callback(true);
			} catch (err) {
				await transaction.rollback();

				return callback(false, "Failed to edit message");
			}
		});

		// socket.on("addChannelUser", async (userId, channelId, callback) => {
		// 	const user = await User.findByPk(userId)
		// 	if (!user) {
		// 		return callback(false, "No such user")
		// 	}

		// });
	}
});

export default io;
