import {
  EktActivityData,
  EktActivityRow,
  EktApiResponse,
  EktMyActivityRow,
  EktRegisterActivityData,
} from "./ekt";

export interface ServerToClientEvents {
  requestActivities: (
    callback: (
      response: EktApiResponse<EktActivityData<EktActivityRow>> | null,
      err?: string
    ) => void
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
  requestMyActivities: (
    id: string,
    password: string,
    callback: (
      response: EktApiResponse<EktActivityData<EktMyActivityRow>> | null,
      err?: string
    ) => void
  ) => void;
  editCheckInDate: (
    id: string,
    password: string,
    activityId: string,
    checkInDate: string,
    checkOutDate: string,
    callback: (response: EktApiResponse<null> | null, err?: string) => void
  ) => void;
}

export interface ClientToServerEvents {}

export interface InterServerEvents {}

export interface SocketData {}
