import { Router } from "express";

export const messageRoute = Router();

messageRoute.get('/message', (req, res) => {
    res.send("This is the message route")
})