import { EktActivityRow } from "./ekt";

export interface ProxyApiResponse {
  payload: any;
  msg: string;
}

export type FilteredActivityA = Pick<
  EktActivityRow,
  | "createTime"
  | "id"
  | "activityName"
  | "activityIntegral"
  | "activityHost"
  | "startTime"
  | "endTime"
  | "activityAddress"
  | "activityDec"
  | "signTime"
  | "activityNum"
  | "signNum"
  | "activityStatus"
>;

export interface Activity {
  id: string;
  createTime: string;
  name: string;
  point: number;
  host: string;
  signTime: string;
  startTime: string;
  endTime: string;
  addr: string;
  desc: string;
  regNum: number;
  maxRegNum: number | null;
  status: number;
}
