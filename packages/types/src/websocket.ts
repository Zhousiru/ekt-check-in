import {
  EktActivityData,
  EktActivityRow,
  EktApiResponse,
  EktRegisterActivityData,
} from "./ekt";

export interface ServerToClientEvents {
  requestActivities: (
    pageSize: number,
    callback: (
      response: EktApiResponse<EktActivityData<EktActivityRow>> | null,
      err?: Error
    ) => void,
    pageNo?: number
  ) => void;
  registerActivity: (
    id: string,
    activityId: string,
    callback: (
      response: EktApiResponse<EktRegisterActivityData> | null,
      err?: Error
    ) => void
  ) => void;
}

export interface ClientToServerEvents {}

export interface InterServerEvents {}

export interface SocketData {}
