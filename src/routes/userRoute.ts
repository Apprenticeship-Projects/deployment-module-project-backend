import { Router } from "express";
import { User } from "../db/models";
import * as bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import { SALT_ROUNDS } from "../constants";
import validate from "../middleware/validate";

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
			const createdUser = await User.create({
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

userRoute.get("/me", (req, res) => {
	res.send("This is the user/me GET route");
});

userRoute.put("/me", (req, res) => {
	res.send("This is the user/me PUT route");
});

userRoute.delete("/me", (req, res) => {
	res.send("This is the user/me DELETE route");
});
