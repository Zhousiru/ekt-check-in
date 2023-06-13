export interface ProxyApiResponse<T> {
  payload: T;
  msg: string;
}

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
