import "./utils/env";
import "./sockets";
import server from "./app";
import { initDatabase } from "./db";

const port = process.env.PORT;

await initDatabase();

server.listen(port, () => {
	console.log(`[Server]: Server is running at http://localhost:${port}`);
});
