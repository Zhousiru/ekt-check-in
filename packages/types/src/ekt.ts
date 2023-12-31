export interface EktApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

export interface EktRegisterActivityData {
  msg: string;
  code: string;
}

export interface EktActivityData<T> {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalRows: number;
  rows: T[];
  rainbow: number[];
}

export interface EktActivityRow {
  createTime: string;
  createUser: string;
  updateTime: string;
  updateUser: string;
  id: string;
  dataType: string;
  activityCode: unknown;
  activityName: string;
  activityType: string;
  activityIntegral: number;
  activityLx: string;
  activityHost: string;
  activityAss: unknown;
  startTime: string;
  endTime: string;
  activityCampus: string;
  activityAddress: string;
  homeWork: string;
  activityImg: string;
  activityFile: unknown;
  activityDec: string;
  activityManager: string;
  activityPhone: string;
  activityCheck: string;
  signTime: string;
  activityNum: number | null;
  signNum: number;
  activityFaculty: string;
  activityGrade: string;
  activityYear: string;
  activityOrganization: string;
  activitySex: string;
  activityOw: unknown;
  activityFunds: unknown;
  activitySummary: unknown;
  reviewAnnex: unknown;
  activityStatus: string;
  semester: unknown;
  year: unknown;
  yearId: unknown;
  semesterId: unknown;
  isDelete: unknown;
  isSign: string;
}

export interface EktMyActivityRow {
  createTime: string;
  createUser: string;
  updateTime: string;
  updateUser: string;
  id: string;
  activityId: string;
  studentId: string;
  roleName: string;
  studentName: string;
  studentCode: string;
  collegeName: string;
  collegeId: string;
  activitySignTime: string;
  activitySignStatus: string;
  signDisagreeReason: string | null;
  activitySignDes: string | null;
  signInTime: string | null;
  signOutTime: string | null;
  duration: unknown;
  leaveSituation: unknown;
  leaveTime: string | null;
  leaveResult: string;
  leaveDisagreeReason: string | null;
  integral: number;
  assumeRole: unknown;
  task: unknown;
  isDelete: unknown;
}
