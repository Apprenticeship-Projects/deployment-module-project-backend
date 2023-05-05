import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import { sessionMiddleware } from "./sessions";

const app = express();
const server = http.createServer(app);

app.use(
	cors({
		origin: "http://localhost:3000",
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
	res.send("Test Server");
});

export default server;
