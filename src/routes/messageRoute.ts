import { Router } from "express";

export const messageRoute = Router();

messageRoute.get('/{id}', (req, res) => {
    res.send("This is the message/{id} GET route")
})

messageRoute.post('/{id}', (req, res) => {
    res.send("This is the message/{id} POST route")
})

messageRoute.put('/{id}', (req, res) => {
    res.send("This is the message/{id} POST route")
})

messageRoute.delete('/{id}', (req, res) => {
    res.send("This is the message/{id} DELETE route")
})