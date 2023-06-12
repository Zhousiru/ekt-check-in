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

// TODO

// DEBUG
io.on("connection", (socket) => {
  console.log(socket.id, "Connected");
});

setInterval(async () => {
  const sockets = await io.fetchSockets();
  console.log(sockets.map((x) => x.id).join(" "));
  sockets[0].emit("requestActivities", 20, (a: any) => {
    console.log("GET", a);
  });
}, 5000);

io.listen(config.proxy.port);
