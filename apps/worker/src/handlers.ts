import { EktActivityRow, EktApiResponse } from "@ekt-check-in/types/ekt";
import { ServerToClientEvents } from "@ekt-check-in/types/websocket";
import client from "./client";
import { randomAccount } from "./utils";

const handleRequestActivities: ServerToClientEvents["requestActivities"] =
  async (
    pageSize: number,
    callback: (
      response: EktApiResponse<EktActivityRow> | null,
      err?: Error
    ) => void,
    pageNo?: number
  ) => {
    let apiToken: string | null = null;

    for (let count = 1; count <= 5; count++) {
      const res = await client.post("http://ekt.cuit.edu.cn/api/login", {
        account: randomAccount(),
        password: "123456",
      });

      if (res.data.success) {
        apiToken = res.data.data;
        break;
      }
    }

    if (!apiToken) {
      callback(null, new Error("failed to login"));
      return;
    }

    const res = await client.get(
      "http://ekt.cuit.edu.cn/api/activityInfo/page",
      {
        params: {
          pageSize,
          pageNo,
        },
        headers: { Authorization: `Bearer ${apiToken}` },
      }
    );

    callback(res.data);
  };

export { handleRequestActivities };
