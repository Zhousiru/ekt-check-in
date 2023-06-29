import { config } from "@ekt-check-in/config";
import {
  EktActivityData,
  EktActivityRow,
  EktApiResponse,
  EktMyActivityRow,
  EktRegisterActivityData,
} from "@ekt-check-in/types/ekt";
import { ServerToClientEvents } from "@ekt-check-in/types/websocket";
import client from "./client";
import { loginAccount, randomAccount } from "./utils";

const handleRequestActivities: ServerToClientEvents["requestActivities"] =
  async (
    callback: (
      response: EktApiResponse<EktActivityData<EktActivityRow>> | null,
      err?: string
    ) => void
  ) => {
    let apiToken: string | null = null;
    let errorMessage: string | undefined = undefined;

    for (let count = 1; count <= 5; count++) {
      // TODO: Filter out non-default password account.
      const random = randomAccount();
      try {
        apiToken = await loginAccount(random, "123456");
        errorMessage = undefined;
        break;
      } catch (error) {
        if (error instanceof Error) {
          errorMessage = error.message;
        }
      }
    }

    if (!apiToken || errorMessage) {
      callback(null, errorMessage);
      return;
    }

    const res = await client.get<
      EktApiResponse<EktActivityData<EktActivityRow>>
    >("http://ekt.cuit.edu.cn/api/activityInfo/page", {
      params: {
        pageSize: config.worker.defaultPageSize,
      },
      headers: { Authorization: `Bearer ${apiToken}` },
    });

    callback(res.data);
  };

const handleRegisterActivity: ServerToClientEvents["registerActivity"] = async (
  id: string,
  password: string,
  activityId: string,
  callback: (
    response: EktApiResponse<EktRegisterActivityData> | null,
    err?: string
  ) => void
) => {
  try {
    const apiToken = await loginAccount(id, password);

    const res = await client.post<EktApiResponse<EktRegisterActivityData>>(
      "http://ekt.cuit.edu.cn/api/activityInfoSign/add",
      {
        activityId: activityId,
      },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );

    if (!res.data.success || res.data.data.code !== "1") {
      throw new Error(`failed to register activity: ${res.data.data.msg}`);
    }

    callback(res.data);
  } catch (error) {
    if (error instanceof Error) {
      callback(null, error.message);
    }
  }
};

const handleRequestMyActivities: ServerToClientEvents["requestMyActivities"] =
  async (
    id: string,
    password: string,
    callback: (
      response: EktApiResponse<EktActivityData<EktMyActivityRow>> | null,
      err?: string
    ) => void
  ) => {
    try {
      const apiToken = await loginAccount(id, password);

      const res = await client.get<
        EktApiResponse<EktActivityData<EktMyActivityRow>>
      >("http://ekt.cuit.edu.cn/api/activityInfoSign/my", {
        params: {
          pageSize: config.worker.defaultPageSize,
        },
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });

      if (!res.data.success || res.data.code !== 200) {
        throw new Error(`failed to request my activities: ${res.data.message}`);
      }

      callback(res.data);
    } catch (error) {
      if (error instanceof Error) {
        callback(null, error.message);
      }
    }
  };

const handleEditCheckInDate: ServerToClientEvents["editCheckInDate"] = async (
  id: string,
  password: string,
  activityId: string,
  checkInDate: string,
  checkOutDate: string,
  callback: (response: EktApiResponse<null> | null, err?: string) => void
) => {
  try {
    const apiToken = await loginAccount(id, password);

    const activityRes = await client.get<
      EktApiResponse<EktActivityData<EktMyActivityRow>>
    >("http://ekt.cuit.edu.cn/api/activityInfoSign/my", {
      params: {
        activityId: activityId,
      },
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    if (!activityRes.data.success || activityRes.data.code !== 200) {
      throw new Error(
        `failed to request my activities: ${activityRes.data.message}`
      );
    }

    if (activityRes.data.data.rows.length !== 1) {
      throw new Error(`invalid activity id`);
    }

    const checkInId = activityRes.data.data.rows[0].id;

    const res = await client.post<EktApiResponse<null>>(
      "http://ekt.cuit.edu.cn/api/activityInfoSign/edit",
      {
        id: checkInId,
        signInTime: checkInDate,
        signOutTime: checkOutDate,
      },
      {
        headers: { Authorization: `Bearer ${apiToken}` },
      }
    );

    if (!res.data.success || res.data.code !== 200) {
      throw new Error(`failed to edit check-in data: ${res.data.message}`);
    }

    callback(res.data);
  } catch (error) {
    if (error instanceof Error) {
      callback(null, error.message);
    }
  }
};

export {
  handleEditCheckInDate,
  handleRegisterActivity,
  handleRequestActivities,
  handleRequestMyActivities,
};
