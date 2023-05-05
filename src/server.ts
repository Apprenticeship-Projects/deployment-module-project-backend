import "./utils/env";
import "./sockets";
import server from "./app";
import { initDatabase } from "./db";

await initDatabase();

const port = process.env.PORT;

server.listen(port, () => {
	console.log(`[Server]: Server is running at http://localhost:${port}`);
});
