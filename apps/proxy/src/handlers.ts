import { Activity, ProxyApiResponse } from "@ekt-check-in/types/api";
import {
  EktActivityData,
  EktActivityRow,
  EktApiResponse,
  EktRegisterActivityData,
} from "@ekt-check-in/types/ekt";
import { Request, Response } from "express";
import { getWorkerWithResponse, responseWithWorkerError } from "./utils";

export async function handleRequestActivities(req: Request, res: Response) {
  const worker = await getWorkerWithResponse(res);
  if (!worker) {
    return;
  }

  try {
    const apiRes = await new Promise<
      EktApiResponse<EktActivityData<EktActivityRow>>
    >((resolve, reject) => {
      worker.emit(
        "requestActivities",
        50,
        (
          response: EktApiResponse<EktActivityData<EktActivityRow>> | null,
          err?: string
        ) => {
          if (err || !response) {
            reject(err);
            return;
          }
          resolve(response);
        }
      );
    });

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
    responseWithWorkerError(res, err);
    return;
  }
}

export async function handleRegisterActivity(req: Request, res: Response) {
  const worker = await getWorkerWithResponse(res);
  if (!worker) {
    return;
  }

  const { id, password, activityId } = req.query;

  for (const qs of [id, password, activityId]) {
    if (typeof qs !== "string") {
      const r: ProxyApiResponse<null> = {
        payload: null,
        msg: `invalid query params`,
      };
      res.status(400).json(r);
      return;
    }
  }

  try {
    const apiRes = await new Promise<EktApiResponse<EktRegisterActivityData>>(
      (resolve, reject) => {
        worker.emit(
          "registerActivity",
          <string>id,
          <string>password,
          <string>activityId,
          (
            response: EktApiResponse<EktRegisterActivityData> | null,
            err?: string
          ) => {
            if (err || !response) {
              reject(err);
              return;
            }
            resolve(response);
          }
        );
      }
    );

    const r: ProxyApiResponse<null> = {
      payload: null,
      msg: `successfully registered: ${apiRes.data.msg}`,
    };
    res.status(200).json(r);
  } catch (err) {
    responseWithWorkerError(res, err);
    return;
  }
}
