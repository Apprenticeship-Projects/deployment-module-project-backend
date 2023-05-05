import { Router } from "express";

export const channelRoute = Router();

channelRoute.post('/create', (req, res) => {
    res.send("This is the channel/create POST route")
})

channelRoute.get('/{id}', (req, res) => {
    res.send("This is the channel/{id} GET route")
})

channelRoute.put('/{id}', (req, res) => {
    res.send("This is the channel/{id} PUT route")
})

channelRoute.delete('/{id}', (req, res) => {
    res.send("This is the channel/{id} DELETE route")
})