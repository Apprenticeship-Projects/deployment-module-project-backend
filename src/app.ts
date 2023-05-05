import express, { Express, Request, Response } from 'express';
import cors from 'cors';


const app: Express = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.get('/', (req: Request, res: Response) => {
    res.send('Test Server');
  });
  
export default app;