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
      err?: string
    ) => void,
    pageNo?: number
  ) => void;
  registerActivity: (
    id: string,
    password: string,
    activityId: string,
    callback: (
      response: EktApiResponse<EktRegisterActivityData> | null,
      err?: string
    ) => void
  ) => void;
}

export interface ClientToServerEvents {}

export interface InterServerEvents {}

export interface SocketData {}
