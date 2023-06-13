import { config } from "@ekt-check-in/config";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@ekt-check-in/types/websocket";
import { Socket, io } from "socket.io-client";
import { handleRequestActivities } from "./handlers";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  config.worker.proxyAddress,
  {
    auth: { token: config.proxy.token },
  }
);

socket.io.on("open", () => {
  console.log(`Successfully connected to proxy server`);
});

socket.on("connect_error", (err) => {
  console.log(`Failed to connect to proxy server: ${err.message}`);
});

socket.on("requestActivities", handleRequestActivities);
