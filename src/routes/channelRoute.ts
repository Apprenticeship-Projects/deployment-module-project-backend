import { Router } from "express";

export const channelRoute = Router();

channelRoute.get('/', (req, res) => {
    res.send("This is the channel route")
})