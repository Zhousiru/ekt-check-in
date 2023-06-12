export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: {
    pageNo: number;
    pageSize: number;
    totalPage: number;
    totalRows: number;
    rows: T[];
    rainbow: number[];
  };
}

export interface ActivityRow {
  createTime: string;
  createUser: string;
  updateTime: string;
  updateUser: string;
  id: string;
  dataType: string;
  activityCode?: unknown;
  activityName: string;
  activityType: string;
  activityIntegral: number;
  activityLx: string;
  activityHost: string;
  activityAss?: unknown;
  startTime: string;
  endTime: string;
  activityCampus: string;
  activityAddress: string;
  homeWork: string;
  activityImg: string;
  activityFile?: unknown;
  activityDec: string;
  activityManager: string;
  activityPhone: string;
  activityCheck: string;
  signTime: string;
  activityNum?: number;
  signNum: number;
  activityFaculty: string;
  activityGrade: string;
  activityYear: string;
  activityOrganization: string;
  activitySex: string;
  activityOw?: unknown;
  activityFunds?: unknown;
  activitySummary?: unknown;
  reviewAnnex?: unknown;
  activityStatus: string;
  semester?: unknown;
  year?: unknown;
  yearId?: unknown;
  semesterId?: unknown;
  isDelete?: unknown;
  isSign: string;
}
