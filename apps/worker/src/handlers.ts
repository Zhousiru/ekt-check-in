import {
  EktActivityData,
  EktActivityRow,
  EktApiResponse,
  EktRegisterActivityData,
} from "@ekt-check-in/types/ekt";
import { ServerToClientEvents } from "@ekt-check-in/types/websocket";
import client from "./client";
import { loginAccount, randomAccount } from "./utils";

const handleRequestActivities: ServerToClientEvents["requestActivities"] =
  async (
    pageSize: number,
    callback: (
      response: EktApiResponse<EktActivityData<EktActivityRow>> | null,
      err?: string
    ) => void,
    pageNo?: number
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
        pageSize,
        pageNo,
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

    if (!res.data.success || res.data.data.code != "1") {
      throw new Error(`failed to register activity: ${res.data.data.msg}`);
    }

    callback(res.data);
  } catch (error) {
    if (error instanceof Error) {
      callback(null, error.message);
    }
  }
};

export { handleRegisterActivity, handleRequestActivities };
