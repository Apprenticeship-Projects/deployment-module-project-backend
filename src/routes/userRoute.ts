import { Router } from "express";

export const userRoute = Router();

userRoute.get('/', (req, res) => {
    res.send("This is the user route")
})