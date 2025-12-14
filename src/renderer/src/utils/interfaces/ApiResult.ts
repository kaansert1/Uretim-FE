export interface IApiGetListResult<T> {
  data: T[];
  success: boolean;
}
export interface IApiGetObjectResult<T> {
  data: T;
  success: boolean;
}
export interface IApiPostObjectResult<T> {
  data: T;
  success: boolean;
  message: string;
}
export interface IApiPostListResult<T> {
  data: T[];
  success: boolean;
  message: string;
}
export interface IApiErrorResult {
  success: boolean;
  message: string;
}
export interface IApiPostResult {
  success: boolean;
  message: string;
}
export interface IApiGetPaginationListResult<T> {
  success: boolean;
  message: string;
  totalRecords: number;
  data: T[];
}
