import { Router } from "express";
import { Channel, User } from "../db/models";
import { database } from "../db";

export const channelRoute = Router();

channelRoute.post("/create", async (req, res, next) => {
	const transaction = await database!.transaction();
	try {
		const users = await User.findAll({ where: { username: req.body.usernames } });
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
});

channelRoute.get("/{id}", (req, res) => {
	res.send("This is the channel/{id} GET route");
});

channelRoute.put("/{id}", (req, res) => {
	res.send("This is the channel/{id} PUT route");
});

channelRoute.delete("/{id}", (req, res) => {
	res.send("This is the channel/{id} DELETE route");
});
