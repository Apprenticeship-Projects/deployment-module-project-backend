import fs from "fs";
import path from "path";
import cluster from "node:cluster";
import pino, { LogDescriptor } from "pino";
import pretty, { colorizerFactory } from "pino-pretty";
import { LOGGER_OUT_PATH } from "../constants";
import parseTimespan from "./functions/parseTimespan";

const options: pino.LoggerOptions = {
	level: "trace",
};

let maxLogFiles = parseInt(process.env.LOGS_MAX_LOG_FILES ?? "-1");
if (isNaN(maxLogFiles)) maxLogFiles = -1;

if (cluster.isPrimary && !fs.existsSync(LOGGER_OUT_PATH)) {
	fs.mkdirSync(LOGGER_OUT_PATH);
}

const files = fs.readdirSync(LOGGER_OUT_PATH, {
	withFileTypes: true,
});

const datedLogFiles: number[] = [];
for (const file of files) {
	if (!file.isFile()) continue;

	const filePath = path.parse(file.name);
	if (filePath.ext !== ".log") continue;

	const time = parseInt(filePath.name);
	if (isNaN(time)) continue;
	datedLogFiles.push(time);
}

datedLogFiles.sort();
datedLogFiles.reverse();

if (cluster.isPrimary) {
	let earliestDate: Date | null = null;
	if (process.env.LOGS_DELETE_OLD_FILES === "true") {
		const max_age = parseTimespan(process.env.LOGS_MAX_FILE_AGE ?? "1w");
		earliestDate = max_age ? new Date(Date.now() - max_age) : null;
	}

	for (const [i, time] of datedLogFiles.entries()) {
		const fileName = time.toString();
		const logDate = new Date(time * 1000);

		let doDelete = false;
		if (earliestDate && logDate < earliestDate) {
			doDelete = true;
		} else if (maxLogFiles >= 0 && i >= maxLogFiles) {
			doDelete = true;
		}

		if (doDelete) {
			fs.rmSync(path.join(LOGGER_OUT_PATH, fileName + ".log"));
		}
	}
}

const streams: pino.StreamEntry[] = [];

if (process.env.LOGS_OUTPUT_CONSOLE === "true") {
	const stdoutLevel = "debug";
	streams.push({
		level: stdoutLevel,
		stream:
			process.env.LOGS_PRINT_PRETTY === "true"
				? pretty({
						colorize: true,
						colorizeObjects: true,
						ignore: "hostname,req,res,err,responseTime",
						messageFormat: (log: LogDescriptor, messageKey: string) => {
							const message = log[messageKey];
							const level = log["level"] ?? 30;

							let color = "\x1b[0m";
							if (level >= 50) {
								color = "\x1b[1m\x1b[31m";
							} else if (level >= 40) {
								color = "\x1b[33m";
							} else if (level >= 30) {
								color = "\x1b[36m";
							} else if (level >= 20) {
								color = "\x1b[2m\x1b[34m";
							} else if (level >= 0) {
								color = "\x1b[90m";
							}

							return `${color}${message}\x1b[0m`;
						},
						customPrettifiers: {
							pid: (pid) =>
								`${
									cluster.isWorker
										? `Worker${cluster.worker?.id}) (`
										: ""
								}${pid}`,
							level: (level) =>
								`[${colorizerFactory(true)(
									pino.levels.labels[
										parseInt(level as string)
									].toUpperCase()
								)}]`,
						},
				  })
				: process.stdout,
	});
}

if (process.env.LOGS_OUTPUT_FILE === "true" && maxLogFiles !== 0) {
	streams.push({
		level: "trace",
		stream: pino.destination({
			dest: path.join(LOGGER_OUT_PATH, "latest.log"),
			append: true,
			sync: true,
		}),
	});

	const latestTime = datedLogFiles[0];
	let datedFileName = "";
	if (latestTime && Math.abs(latestTime - Date.now() / 1000) < 3) {
		datedFileName = latestTime.toString();
	} else {
		datedFileName = Math.ceil(Date.now() / 1000).toString();
	}

	streams.push({
		level: "trace",
		stream: pino.destination({
			dest: path.join(LOGGER_OUT_PATH, `${datedFileName}.log`),
			sync: true,
		}),
	});
}

const logger = pino(options, pino.multistream(streams));

export default logger;
