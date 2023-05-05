import { Router } from "express";

export const channelRoute = Router();

channelRoute.get('/channel', (req, res) => {
    res.send("This is the channel route")
})