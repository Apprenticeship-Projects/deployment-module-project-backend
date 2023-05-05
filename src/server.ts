import "./utils/env";
import server from "./app";

const port = process.env.PORT;

server.listen(port, () => {
	console.log(`[Server]: Server is running at http://localhost:${port}`);
});
