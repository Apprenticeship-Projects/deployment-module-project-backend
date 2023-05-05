import { Router } from "express";

export const messageRoute = Router();

messageRoute.get('/', (req, res) => {
    res.send("This is the message route")
})