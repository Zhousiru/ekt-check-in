import { Activity, ProxyApiResponse } from "@ekt-check-in/types/api";
import { EktActivityRow, EktApiResponse } from "@ekt-check-in/types/ekt";
import { Request, Response } from "express";
import { getWebsocketServer } from "./websocket";

export async function handleRequestActivities(req: Request, res: Response) {
  const server = getWebsocketServer();
  if (server.engine.clientsCount === 0) {
    const r: ProxyApiResponse<null> = {
      payload: null,
      msg: "no workers online",
    };
    res.status(500).json(r);
    return;
  }

  const sockets = await server.fetchSockets();
  const selectedSocket = sockets[Math.floor(Math.random() * sockets.length)];

  try {
    const apiRes = await new Promise<EktApiResponse<EktActivityRow>>(
      (resolve, reject) => {
        selectedSocket.emit(
          "requestActivities",
          50,
          (response: EktApiResponse<EktActivityRow> | null, err?: Error) => {
            if (err || !response) {
              reject(err);
              return;
            }
            resolve(response);
          }
        );
      }
    );

    const activities = apiRes.data.rows.map((row): Activity => {
      return {
        id: row.id,
        createTime: row.createTime,
        name: row.activityName,
        point: row.activityIntegral,
        host: row.activityHost,
        signTime: row.signTime,
        startTime: row.startTime,
        endTime: row.endTime,
        addr: row.activityAddress,
        desc: row.activityDec,
        regNum: row.signNum,
        maxRegNum: row.activityNum,
        status: Number(row.activityStatus),
      };
    });

    const r: ProxyApiResponse<Activity[]> = {
      payload: activities,
      msg: "",
    };
    res.status(200).json(r);
  } catch (err) {
    const r: ProxyApiResponse<null> = {
      payload: null,
      msg: "failed to get response from workers",
    };
    res.status(500).json(r);
    return;
  }
}
