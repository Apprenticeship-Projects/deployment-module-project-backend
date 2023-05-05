import { Server, Socket } from "socket.io";
import server from "./app";
import { sessionMiddleware } from "./sessions";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { ExtendedError } from "socket.io/dist/namespace";
import passport from "passport";

const io = new Server(server, {
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
	}
});
