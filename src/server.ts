import "./utils/env";
import "./sockets";
import server from "./app";
import { initDatabase } from "./db";
import logger from "./utils/logger";

await initDatabase();

const port = process.env.PORT;

server.listen(port, () => {
	logger.info(`Server is running at http://localhost:${port}`);
});
