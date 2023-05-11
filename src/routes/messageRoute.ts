import { Request, Router } from "express";
import { Channel, Message } from "../db/models";
import { auth } from "../middleware/auth";
import { formatMessage } from "../utils/messages";
import { database } from "../db";
import io from "../sockets";

export const messageRoute = Router();

messageRoute.use(auth);

messageRoute.get("/:channelId/all", auth, async (req, res, next) => {
	try {
		const messages = await Message.findAll({
			where: {
				"$channel.id$": req.params.channelId,
			},
			include: [Message.associations.channel],
			order: [["createdAt", "DESC"]],
			limit: 100,
		});
		const formattedMessages = await Promise.all(
			messages.map((message) => formatMessage(message))
		);

		res.send(formattedMessages);
	} catch (err) {
		next(err);
	}
});

messageRoute.get("/:id", auth, async (req, res, next) => {
	try {
		const message = await Message.findOne({
			where: {
				id: req.params.id,
				"$channel.id$": req.params.channelId,
			},
			include: [Message.associations.channel],
		});
		if (!message) {
			res.status(404).send({ message: "No message id" });
		} else {
			const formattedMessage = await formatMessage(message);
			res.send(formattedMessage);
		}
	} catch (err) {
		next(err);
	}
});

messageRoute.post(
	"/",
	async (
		req: Request<
			any,
			any,
			{
				channelId: number;
				content: string;
			}
		>,
		res,
		next
	) => {
		const channel = await Channel.findByPk(req.body.channelId);
		if (!channel) {
			return res.status(404).send({
				message: "No such channel",
			});
		}
		if (
			(
				await req.user!.getChannels({
					where: {
						id: channel.id,
					},
				})
			).length === 0
		) {
			return res.status(400).send({
				message: "Not in channel",
			});
		}

		const transaction = await database!.transaction();

		try {
			const message = await channel.createMessage(
				{
					content: req.body.content,
				},
				{ transaction }
			);
			await message.setUser(req.user, { transaction });

			await transaction.commit();

			io.to(`channel-${channel.id}`).emit(
				"messageSent",
				await formatMessage(message)
			);
			res.sendStatus(200);
		} catch (err) {
			await transaction.rollback();
			next(err);
		}
	}
);

messageRoute.put(
	"/:id",
	async (
		req: Request<
			{
				id: number;
			},
			any,
			{
				content: string;
			}
		>,
		res,
		next
	) => {
		const message = await Message.findByPk(req.params.id);
		if (!message) {
			return res.status(404).send({
				message: "No such message",
			});
		}
		if ((await message.getUser()).id !== req.user!.id) {
			return res.status(400).send({
				message: "Not your message",
			});
		}

		const transaction = await database!.transaction();

		try {
			await message.update(
				{
					content: req.body.content,
					isEdited: true,
					editedAt: new Date(),
				},
				{ transaction }
			);

			const channel = await message.getChannel({
				transaction,
			});

			await transaction.commit();

			io.to(`channel-${channel.id}`).emit(
				"messageEdited",
				await formatMessage(message)
			);
			res.sendStatus(200);
		} catch (err) {
			await transaction.rollback();
			next(err);
		}
	}
);

messageRoute.delete("/:id", async (req, res, next) => {
	const message = await Message.findByPk(req.params.id);
	if (!message) {
		return res.status(404).send({
			message: "No such message",
		});
	}
	if ((await message.getUser()).id !== req.user!.id) {
		return res.status(400).send({
			message: "Not your message",
		});
	}

	const transaction = await database!.transaction();

	try {
		await message.destroy({ transaction });

		const channel = await message.getChannel({
			transaction,
		});

		await transaction.commit();

		io.to(`channel-${channel.id}`).emit("messageDeleted", message.id);
		res.sendStatus(200);
	} catch (err) {
		await transaction.rollback();
		next(err);
	}
});
