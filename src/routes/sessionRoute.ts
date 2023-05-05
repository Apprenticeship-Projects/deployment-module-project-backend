import { Router } from "express";

export const sessionRoute = Router();

sessionRoute.get('/', (req, res) => {
    res.send("This is the session route")
})