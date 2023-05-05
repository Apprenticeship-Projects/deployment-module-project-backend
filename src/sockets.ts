import { Server } from "socket.io";
import server from "./app";

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
	},
});

io.on("connection", (socket) => {
	console.log("a user connected");
});

export default server;
