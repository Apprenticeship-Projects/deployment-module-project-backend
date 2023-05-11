import http from "http";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swagger from "swagger-ui-express";
import swaggerDoc from "./swagger.json" assert { type: "json" };
import passport from "passport";
import { sessionMiddleware } from "./sessions";
import routes from "./routes";
import { defaultRoute } from "./routes/defaultRoute";
import { userRoute } from "./routes/userRoute";
import { sessionRoute } from "./routes/sessionRoute";
import { channelRoute } from "./routes/channelRoute";
import { messageRoute } from "./routes/messageRoute";

const app = express();
const server = http.createServer(app);

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", defaultRoute);
app.use("/user", userRoute);
app.use("/session", sessionRoute);
app.use("/channel", channelRoute);
app.use("/message", messageRoute);

app.use(
	"/docs",
	swagger.serve,
	swagger.setup(swaggerDoc, {
		customSiteTitle: "Chat App API",
	})
);

app.use((err: Error | Error[], _req: Request, res: Response, _next: NextFunction) => {
	const errors = Array.isArray(err) ? err : [err];
	for (const error of errors) {
		console.error(`[${error.name}] ${error.message}: ${error.stack}`);
	}

	if (res.headersSent) return;

	res.status(500).send({
		message: "An error occured on the server!",
		errors,
	});
});

export default server;
