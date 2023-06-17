import { ProxyApiResponse } from "@ekt-check-in/types/api";
import { Response } from "express";
import { getWebsocketServer } from "./websocket";

export async function getWorkerWithResponse(res: Response) {
  const server = getWebsocketServer();
  if (server.engine.clientsCount === 0) {
    const r: ProxyApiResponse<null> = {
      payload: null,
      msg: "no workers online",
    };
    res.status(500).json(r);

    return null;
  }

  const sockets = await server.fetchSockets();

  return sockets[Math.floor(Math.random() * sockets.length)];
}

export function responseWithWorkerError(res: Response, err: unknown) {
  let r: ProxyApiResponse<null> = {
    payload: null,
    msg: "failed to get response from workers",
  };

  if (typeof err === "string") {
    r = {
      payload: null,
      msg: `failed to get response from workers: ${err}`,
    };
  }

  res.status(500).json(r);
}
