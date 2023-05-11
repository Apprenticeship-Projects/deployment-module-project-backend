import { Router } from "express";
import { Message } from "../db/models";
import { check } from "express-validator";
import { auth } from "../middleware/auth";
import { formatMessage } from "../utils/messages";

export const messageRoute = Router();

// websocket
// messageRoute.post('/create', async (req, res) => {
//     // req.user
//     if (req.isAuthenticated()) {
//         try {
//             const message = await Message.create(req.body)
//             res.status(201).send(message)
//         } catch (err) {
//             res.status(500).send({error: err})
//         }
//     } else {
//         res.status(404).send({error: "User not authenticated"})
//     }

//     // res.send("This is the message/{id} POST route")
// })

messageRoute.get("/:channelId", auth, async (req, res, next) => {
	try {
		const messages = await Message.findAll({
			where: {
				"$channel.id$": req.params.channelId,
			},
			include: [Message.associations.channel],
			order: [["createdAt", "DESC"]],
			limit: 100,
		});
        const formattedMessages = await Promise.all(messages.map(message => formatMessage(message)))

		res.send(formattedMessages);
	} catch (err) {
        next(err)
    }
});

messageRoute.get("/:channelId/:id", auth, async (req, res, next) => {
	try {
		const message = await Message.findOne({
			where: {
                id: req.params.id,
				"$channel.id$": req.params.channelId,
			},
			include: [Message.associations.channel],
		});
        if (!message) {
            res.status(404).send({message: "No message id"})
        } else {
            const formattedMessage = await formatMessage(message)
            res.send(formatMessage);
        }
	} catch (err) {
        next(err)
    }
});


// websocket
messageRoute.put("/:id", (req, res) => {
	res.send("This is the message/{id} POST route");
});

// websocket
messageRoute.delete("/:id", (req, res) => {
	res.send("This is the message/{id} DELETE route");
});
