import { Router } from "express";

export const userRoute = Router();

userRoute.post('/register', (req, res) => {
    res.send("This is the user/register POST route")
})

userRoute.get('/me', (req, res) => {
    res.send("This is the user/me GET route")
})

userRoute.put('/me', (req, res) => {
    res.send("This is the user/me PUT route")
})

userRoute.delete('/me', (req, res) => {
    res.send("This is the user/me DELETE route")
})