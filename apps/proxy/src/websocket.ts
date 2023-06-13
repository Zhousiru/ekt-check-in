import { config } from "@ekt-check-in/config";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "@ekt-check-in/types/websocket";
import { Server } from "socket.io";

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>();

io.use((socket, next) => {
  const token: string = socket.handshake.auth.token;
  if (token !== config.proxy.token) {
    const err = new Error("invalid token");
    next(err);
  }
  next();
});

io.on("connection", (socket) => {
  console.log(`New worker (${socket.id}) connection established`);
});

export function startWebsocketServer() {
  io.listen(config.proxy.websocketPort);
}

export function getWebsocketServer() {
  return io;
}
