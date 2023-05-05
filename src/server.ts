import dotenv from 'dotenv';
import server from './sockets'

dotenv.config();

const port = process.env.PORT;

server.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
})