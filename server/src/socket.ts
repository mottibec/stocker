import { Server as SocketIOServer, Socket } from "socket.io";
import { trackSymbol } from "./stocks";
import { Server } from "http";

let socketServer: SocketIOServer;

export const createServer = (server: Server) => {
  socketServer = new SocketIOServer(server);

  socketServer.on("connection", (socket: Socket) => {
    socket.on("register", (symbol: string) => {
      trackSymbol(symbol);
      socket.join(symbol);
    });
  });
};

export const sendToRoom = (room: string, event: string, payload: any) => {
  if (!socketServer) {
    throw new Error(
      "Socket.io isn't initialized, call 'createServer()' first."
    );
  }
  socketServer.to(room).emit(event, payload);
};
