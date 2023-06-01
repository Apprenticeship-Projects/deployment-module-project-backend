import { NextFunction, Request, Response } from "express";

export async function auth(req: Request, res: Response, next: NextFunction) {
     if(req.isAuthenticated()) {
        next()
     } else {
        res.status(401).send({message: "User is not authenticated"})
     }
}