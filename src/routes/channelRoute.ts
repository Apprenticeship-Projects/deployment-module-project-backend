import { Request, Router } from "express";
import { Channel, User } from "../db/models";
import { database } from "../db";
import { auth } from "../middleware/auth";
import * as bcrypt from "bcrypt";
import { body } from "express-validator";
import validate from "../middleware/validate";

export const channelRoute = Router();

channelRoute.post(
	"/create",
	auth,
	body("channelName").isLength({
		max: 64,
		min: 5,
	}),
	body("usernames").isArray(),
	body("usernames.*").isString(),
	validate(),
	async (
		req: Request<
			any,
			any,
			{
				usernames: string[];
				channelName: string;
			}
		>,
		res,
		next
	) => {
		const transaction = await database!.transaction();
		try {
			const users = await User.findAll({
				where: { username: req.body.usernames },
			});
			users.push(req.user!);

			const channel = await Channel.create(
				{ name: req.body.channelName },
				{ transaction }
			);

			await channel.addUsers(users, { transaction });

			await transaction.commit();

			res.status(200).send(channel);
		} catch (error) {
			await transaction.rollback();
			next(error);
		}
	}
);

channelRoute.get("/all", auth, async (req, res, next) => {
	try {
		const channels = await Channel.findAll();
		res.status(200).send(channels);
	} catch (error) {
		next(error);
	}
});

channelRoute.post("/:id/join", auth, async (req, res, next) => {
	try {
		const isInChannel = await req.user!.getChannels({
			where: { id: req.params.id },
		});

		if (isInChannel.length > 0) {
			return res.status(400).send({ message: "User already in channel" });
		}
		const channel = await Channel.findByPk(req.params.id);

		if (channel) {
			await channel.addUser(req.user!);

			return res.status(200).send({
				message: `${req.user!.username} has joined ${channel?.name}`,
			});
		}
		res.status(400).send({ message: "Channel does not exist" });
	} catch (error) {
		next(error);
	}
});

channelRoute.post("/:id/leave", auth, async (req, res, next) => {
	try {
		const isInChannel = await req.user!.getChannels({
			where: { id: req.params.id },
		});

		if (isInChannel.length === 0) {
			return res.status(400).send({ message: "User is not in channel" });
		}

		const channel = await Channel.findByPk(req.params.id);

		if (channel) {
			await channel.removeUser(req.user!);
			return res.status(200).send({
				message: `${req.user!.username} has left ${channel?.name}`,
			});
		}
		res.status(404).send({ message: "Channel does not exist" });
	} catch (error) {
		next(error);
	}
});

channelRoute.get("/:id", auth, async (req, res, next) => {
	try {
		const channel = await Channel.findByPk(req.params.id, {
			include: { as: "users", model: User, attributes: ["id", "username"] },
		});
		if (channel) {
			return res.status(200).send(channel);
		}
		res.status(404).send({ message: "Channel does not exist" });
	} catch (error) {
		next(error);
	}
});

channelRoute.put("/:id", auth, async (req, res, next) => {
	try {
		const { password } = req.body;
		const correctPassword = await bcrypt.compare(password, req.user!.password);

		if (correctPassword) {
			const channel = await Channel.findByPk(req.params.id);

			if (req.body.newName) channel?.update({ name: req.body.newName });

			res.status(200).send(channel);
		}
		res.status(400).send({ message: "Password required to make channel changes" });
	} catch (error) {
		next(error);
	}
});

channelRoute.delete("/:id", auth, async (req, res, next) => {
	try {
		const { password } = req.body;
		const correctPassword = await bcrypt.compare(password, req.user!.password);

		if (correctPassword) {
			const channel = await Channel.destroy({ where: { id: req.params.id } });

			res.status(200).send(channel);
		}
		res.status(400).send({ message: "Password required to make channel changes" });
	} catch (error) {
		next(error);
	}
});
