import io from "socket.io-client";
import axios from "axios";

const client = io("http://localhost:3030", { autoConnect: true, transports: ["websocket"] });

const searchForStock = async (text: string) => {
  const response = await axios.get(
    `http://localhost:3030/search?keywords=${text}`
  );
  return response.data;
};
const onStockUpdate = (symbol: string, stockInfo: any) => {
  console.log(`===== ${symbol} PRICE UPDATE ======`);
  console.log(stockInfo);
};

const subscribeToUpdates = (symbol: string) => {
  client.emit("register", symbol);
  client.on("price-update", (info) => {
    console.log(`on ${symbol}`);
    onStockUpdate(symbol, info);
  });
};

const start = async () => {
  var response = await searchForStock("APPL");
  for (const stock of response) {
    subscribeToUpdates(stock.symbol);
  }
};
start();
