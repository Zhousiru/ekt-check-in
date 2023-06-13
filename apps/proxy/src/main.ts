import { startApiServer } from "./api";
import { startWebsocketServer } from "./websocket";

console.log("Starting WebSocket and API servers...");

startWebsocketServer();
startApiServer();
