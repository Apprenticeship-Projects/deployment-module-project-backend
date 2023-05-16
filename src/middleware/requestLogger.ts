import { Request, Response } from "express";
import pinoHttp from "pino-http";
import logger from "../utils/logger";

function getLogDisplayInfo(
	req: Request,
	res: Response
): {
	statusColor: string;
	methodColor: string;
	responseTag: string;
} {
	let statusColor = "\x1b[32m";
	let responseTag = "SUCCESS";
	if (res.statusCode >= 300 && res.statusCode < 400) {
		statusColor = "\x1b[90m";
		responseTag = "REDIRECT";
	} else if (res.statusCode >= 400 && res.statusCode < 500) {
		statusColor = "\x1b[33m";
		responseTag = "BAD";
	} else if (res.statusCode >= 500) {
		statusColor = "\x1b[31m";
		responseTag = "FATAL";
	}

	responseTag = `${statusColor}${responseTag}\x1b[0m`;

	let methodColor = "\x1b[90m";
	switch (req.method) {
		case "GET":
			methodColor = "\x1b[32m";
			break;
		case "POST":
			methodColor = "\x1b[34m";
			break;
		case "DELETE":
			methodColor = "\x1b[31m";
			break;
		case "PUT":
			methodColor = "\x1b[33m";
			break;
		case "PATCH":
			methodColor = "\x1b[33m";
			break;
	}

	return { statusColor, methodColor, responseTag };
}

const requestLogger = function (prefix?: string) {
	return pinoHttp({
		logger: logger,
		customSuccessMessage: (req_, res, responseTime) => {
			const req = req_ as Request;
			const { statusColor, methodColor, responseTag } = getLogDisplayInfo(
				req,
				res as Response
			);

			return `\x1b[0m${prefix ? `(${prefix}) ` : ""}[${
				req.ip
			}] \x1b[1m${methodColor}${req.method}\x1b[0m ${
				req.originalUrl
			}  -> (${statusColor}${
				res.statusCode
			}\x1b[0m) ${responseTag} protocol=\x1b[36m${req.protocol}/${
				req.httpVersion
			} \x1b[0mtime=\x1b[36m${responseTime}ms\x1b[0m`;
		},
		customErrorMessage: (req_, res, error) => {
			const req = req_ as Request;
			const { statusColor, methodColor, responseTag } = getLogDisplayInfo(
				req,
				res as Response
			);

			return `\x1b[0m${prefix ? `(${prefix}) ` : ""}[${
				req.ip
			}] \x1b[1m${methodColor}${req.method}\x1b[0m ${
				req.originalUrl
			}  -> (${statusColor}${
				res.statusCode
			}\x1b[0m) ${responseTag} protocol=\x1b[36m${req.protocol}/${
				req.httpVersion
			} \x1b[0merr=\x1b[31m${error.message}\x1b[0m`;
		},
		customLogLevel(_req, res, error) {
			return error || res.statusCode >= 500 ? "error" : "info";
		},
	});
};

export default requestLogger;
