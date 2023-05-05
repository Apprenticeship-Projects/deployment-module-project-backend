import { Router } from "express";
import { Message } from "../db/models";

export const messageRoute = Router();

messageRoute.post('/create', async (req, res) => {
    try {
        const message = await Message.create(req.body)
        res.status(201).send(message)
    } catch (err) {
        res.status(500).send({error: err})
    }

    res.send("This is the message/{id} POST route")
})

messageRoute.get('/', async (req, res) => {
    const messsages = await Message.findAll()

    res.send(messsages)
})

messageRoute.get('/{id}', (req, res) => {
    res.send("This is the message/{id} GET route")
})


messageRoute.put('/{id}', (req, res) => {
    res.send("This is the message/{id} POST route")
})

messageRoute.delete('/{id}', (req, res) => {
    res.send("This is the message/{id} DELETE route")
})