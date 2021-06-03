import cors from "cors";
import http from "http";
import cron from "node-cron";
import express from "express";
import { createServer } from "./socket";
import { search, getPrices } from "./stocks";

const httpPort = process.env.PORT ?? 3030;
const app = express();
app.use(cors());
const httpServer = http.createServer(app);

app.use("/search", async (req: express.Request, res: express.Response) => {
  const keywords = req.query.keywords;
  const tickers = await search(keywords);
  res.send(tickers);
});

createServer(httpServer);
httpServer.listen(httpPort);
cron.schedule("* * * * *", getPrices);
