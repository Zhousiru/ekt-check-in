import { ActivityRow, ApiResponse } from "./ekt";

export interface ServerToClientEvents {
  requestActivities: (
    pageSize: number,
    callback: (response: ApiResponse<ActivityRow> | null, err?: Error) => void,
    pageNo?: number
  ) => void;
}

export interface ClientToServerEvents {}

export interface InterServerEvents {}

export interface SocketData {}
