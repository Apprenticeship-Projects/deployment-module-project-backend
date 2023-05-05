import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate";
import passport from "passport";
import { SESSION_COOKIE } from "../sessions";
import io from "../sockets";

export const sessionRoute = Router();

sessionRoute.get("/", (req, res) => {
	res.send({
		id: req.session.id,
		loggedIn: req.isAuthenticated(),
	});
});

sessionRoute.post(
	"/",
	body("username").isString(),
	body("password").isString(),
	validate(),
	passport.authenticate("login"),
	(req, res) => {
		/*
        #swagger.parameters["credentials"] = {
            in: 'body',
            description: 'Your email and password',
        }
        */

		res.status(200).send({
			message: "Logged in",
		});
	}
);

sessionRoute.delete("/", (req, res) => {
	const sessionId = req.session.id;
	req.logout(
		{
			keepSessionInfo: false,
		},
		(err) => {
			res.clearCookie(SESSION_COOKIE);
			io.in(sessionId).disconnectSockets();

			if (err) {
				return res.status(500).send({
					message: "Error while logging out",
					errors: [err],
				});
			}
			res.status(200).send({
				message: "Logged out",
			});
		}
	);
});
