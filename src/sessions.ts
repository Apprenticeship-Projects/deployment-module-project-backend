import passport from "passport";
import * as bcrypt from "bcrypt";
import { Strategy as CustomStrategy } from "passport-custom";
import session from "express-session";
import SessionStore from "./utils/SessionStore";
import { User } from "./db/models";
import { Request } from "express";

export const SESSION_MAX_AGE = 86400 * 1000;
export const SESSION_COOKIE = "chatapp.sid";

const store = new SessionStore({
	maxAge: SESSION_MAX_AGE,
});

export const sessionMiddleware = session({
	secret: process.env.SESSION_SECRET as string,
	resave: false,
	saveUninitialized: false,
	store,
	name: SESSION_COOKIE,
	cookie: {
		domain: process.env.DOMAIN as string,
		sameSite: false,
		maxAge: SESSION_MAX_AGE,
	},
});

passport.serializeUser<number>((user, done) => {
	done(null, user.id);
});

passport.deserializeUser<number>((id, done) => {
	User.findByPk(id)
		.then((user) => done(null, user))
		.catch(done);
});

passport.use(
	"login",
	new CustomStrategy(
		async (
			req: Request<
				any,
				any,
				{
					email: string;
					password: string;
				}
			>,
			done
		) => {
			const { email, password } = req.body;

			if (!email || !password) {
				return done(null);
			}

			User.findOne({
				where: {
					email,
				},
			})
				.then(async (user) => {
					if (!user) {
						return done(null);
					}

					const match = await bcrypt.compare(password, user.password);
					if (match) {
						return done(null, user);
					}
					done(null);
				})
				.catch(done);
		}
	)
);
