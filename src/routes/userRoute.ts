import { Router } from "express";
import { User } from "../db/models";
import * as bcrypt from "bcrypt";
import { body } from "express-validator";
import { SALT_ROUNDS } from "../constants";
import validate from "../middleware/validate";
import { auth } from "../middleware/auth";
import { formatUser } from "../utils/format";
import { UpdateAttributes } from "../typings/types";

export const userRoute = Router();

userRoute.post(
	"/register",
	body("email").isEmail().normalizeEmail({ all_lowercase: true }),
	body("password").isStrongPassword({
		minLength: 8,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	}),
	body("username").isLength({ min: 2, max: 40 }),
	validate(),
	async (req, res, next) => {
		try {
			const { email, username, password } = req.body;

			const userExists = await User.findOne({ where: { email: email } });

			if (userExists) {
				res.status(409).send({ message: "Account already exists" });
				return;
			}

			const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

			await User.create({
				username: username,
				email: email,
				password: hashPassword,
			});

			res.status(200).send({ message: "Account succesfully created" });
		} catch (error) {
			next(error);
		}
	}
);

userRoute.get("/me", auth, async (req, res, next) => {
	try {
		const formattedUser = await formatUser(req.user!);
		res.status(200).send(formattedUser);
	} catch (error) {
		next(error);
	}
});

userRoute.put("/me", auth, async (req, res, next) => {
	try {
		const { newUsername, newPassword, password } = req.body;
		const correctPassword = await bcrypt.compare(password, req.user!.password);
		if (correctPassword) {
			const updateObject: UpdateAttributes<User> = {};

			if (newUsername) updateObject.username = newUsername;

			if (newPassword) {
				const hashPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
				updateObject.password = hashPassword;
			}

			const user = await req.user!.update(updateObject);
			const formattedUser = await formatUser(user);
			return res.status(200).send(formattedUser);
		}
		res.status(400).send({ message: "Password required to make user changes" });
	} catch (error) {
		next(error);
	}
});

userRoute.delete("/me", async (req, res, next) => {
	try {
		const { password } = req.body;
		const correctPassword = await bcrypt.compare(password, req.user!.password);

		if (correctPassword) {
			await req.user!.destroy();
			return res.status(200).send({ message: "User deleted" });
		}
		res.status(400).send({ message: "Password required to make user changes" });
	} catch (error) {
		next(error);
	}
});
