import { EktActivityRow, EktApiResponse } from "./ekt";

export interface ServerToClientEvents {
  requestActivities: (
    pageSize: number,
    callback: (
      response: EktApiResponse<EktActivityRow> | null,
      err?: Error
    ) => void,
    pageNo?: number
  ) => void;
}

export interface ClientToServerEvents {}

export interface InterServerEvents {}

export interface SocketData {}
