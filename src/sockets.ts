import { Server, Socket } from "socket.io";
import server from "./app";
import { sessionMiddleware } from "./sessions";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { ExtendedError } from "socket.io/dist/namespace";
import passport from "passport";
import { OutgoingMessage, UserConnection } from "./typings/types";
import logger from "./utils/logger";

interface ServerToClientEvents {
	messageSent: (data: OutgoingMessage) => void;
	messageEdited: (data: OutgoingMessage) => void;
	messageDeleted: (id: number) => void;
	userJoinedChannel: (data: UserConnection) => void;
	userLeftChannel: (data: UserConnection) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ClientToServerEvents {}

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
	cookie: true,
	cors: {
		origin: "http://localhost:3000",
		credentials: true,
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

	// console.log("User connected");
	// console.log("Authenticated:", req.isAuthenticated());
	// console.log("Handshake:", req);

	logger.info(
		`Socket [${socket.id}] connected. Authenticated: ${req.isAuthenticated()}`
	);
	socket.join(req.session.id);
	// console.log(req.session.id);

	socket.on("disconnect", () => {
		logger.info(`Socket [${socket.id}] disconnect`);
	});

	if (req.isAuthenticated()) {
		const channels = await req.user.getAllChannels();
		const rooms = [];
		for (const channel of channels) {
			rooms.push(`channel-${channel.id}`);
		}

		socket.join(rooms);
	}
});

io.on("error", () => {
	console.log("Socket error");
});

export default io;
