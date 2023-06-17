import { config } from "@ekt-check-in/config";
import { EktApiResponse } from "@ekt-check-in/types/ekt";
import client from "./client";

export function randomAccount() {
  return config.worker.idGenerator();
}

export async function loginAccount(
  id: string,
  password: string
): Promise<string> {
  const res = await client.post<EktApiResponse<string>>(
    "http://ekt.cuit.edu.cn/api/login",
    {
      account: id,
      password: password,
    }
  );

  if (res.data.success) {
    return res.data.data;
  } else {
    throw new Error(`failed to login: ${res.data.message}`);
  }
}
