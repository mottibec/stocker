# Stocker - stock watcher app for demonstrating socket.io auto instrumentation

The app is composed of 2 parts

- `socket.io` + `express` server
- `socket.io-client` app

## Server

Endpoints:

- `/search HTTP GET` endpoint for searching for a stock
- socket.io `register` event listener that receives a stock symbol and notifies the client when a price update arrives

## Client

The client is calling the server search api with the hard coded value `APPL` and then registering the response symbol for updates