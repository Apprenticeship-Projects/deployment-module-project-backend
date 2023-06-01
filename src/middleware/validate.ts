import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export default function (statusCode = 400) {
	return function (req: Request, res: Response, next: NextFunction) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(statusCode).send({
				message: "Received bad or invalid data",
				errors: errors.array(),
			});
		}

		next();
	};
}
