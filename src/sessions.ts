import passport from "passport";
import { Strategy as CustomStrategy } from "passport-custom";
import session from "express-session";
import SessionStore from "./utils/SessionStore";
import { User } from "./db/models";

const SESSION_MAX_AGE = 86400 * 1000;

const store = new SessionStore({
	maxAge: SESSION_MAX_AGE,
});

export const sessionMiddleware = session({
	secret: process.env.SESSION_SECRET as string,
	resave: false,
	saveUninitialized: false,
	store,
	name: "chatapp.sid",
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
	new CustomStrategy(async (req, done) => {
		// add login authentication here
		done(null);
	})
);
