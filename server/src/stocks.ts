import axios from "axios";
import { sendToRoom } from "./socket";

const API_KEY = "6LSFC8ZKTAT78ZDF";
const client = axios.create({ baseURL: "https://www.alphavantage.co/query" });
const trackedSymbols = [];

export const getSymbolQuote = async (symbol: string) => {
  const result = await client.get(
    `?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
  );
  return result.data["Global Quote"];
};

export const search = async (keywords: string) => {
  const result = await client.get(
    `?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${API_KEY}`
  );
  return result.data.bestMatches.map(format);
};

//since alphavantage returns the data as `{index  }key:value` we format it to `key:value`
const format = (stockInfo: any) => {
  return Object.fromEntries(
    Object.entries(stockInfo).map(([key, value]) => {
      const newKey = key.replace(/[^a-z]/g, '');
      return [newKey, value];
    })
  );
};

//add the symbol to the symbols array
export const trackSymbol = (symbol: string) => {
  if (!trackedSymbols.includes(symbol, 0)) {
    trackedSymbols.push(symbol);
  }
};

//iterate over the symbols array, pull the latest update update the clients
export const getPrices = async () => {
  for (const symbol of trackedSymbols) {
    const quote = await getSymbolQuote(symbol);
    notifyClients(symbol, format(quote));
  }
};

//send the update to the clients using socket.io rooms
const notifyClients = (symbol: string, quote: any) => {
  sendToRoom(symbol, "price-update", quote);
};
