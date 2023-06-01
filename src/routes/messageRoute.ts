import { NextFunction, Request, Response, Router } from "express";
import { Channel, Message } from "../db/models";
import { auth } from "../middleware/auth";
import { formatMessage } from "../utils/format";
import { database } from "../db";
import io from "../sockets";
import { body, param } from "express-validator";
import validate from "../middleware/validate";

export const messageRoute = Router();

messageRoute.use(auth);

messageRoute.get("/:channelId/all", async (req, res, next) => {
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

messageRoute.get("/:id", async (req, res, next) => {
	try {
		const message = await Message.findOne({
			where: {
				id: req.params.id,
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
	body("channelId").isInt(),
	body("content").isLength({
		min: 0,
		max: 500,
	}),
	validate(),
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
				await req.user!.getAllChannels({
					id: channel.id,
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

			// console.log(message);

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
	param("id").isInt().toInt(),
	body("content").isLength({
		min: 1,
		max: 500,
	}),
	validate(),
	async (
		req: Request<
			{
				id?: number;
			},
			any,
			{
				content: string;
			}
		>,
		res: Response,
		next: NextFunction
	) => {
		const message = await Message.findByPk(req.params.id!);
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

messageRoute.delete(
	"/:id",
	param("id").isInt().toInt(),
	validate(),
	async (
		req: Request<{
			id?: number;
		}>,
		res: Response,
		next: NextFunction
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
	}
);
