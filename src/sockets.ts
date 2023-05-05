import { Server } from "socket.io";
import server from "./app";
import { sessionMiddleware } from "./sessions";
import { NextFunction, Request, Response } from "express";

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
	},
});

io.use((socket, next) => {
	sessionMiddleware(socket.request as Request, {} as Response, next as NextFunction);
});

io.on("connection", (socket) => {
	console.log("a user connected");
});
