import { IApiGetListResult } from "@/utils/interfaces/ApiResult";
import { IBarrel } from "@/utils/interfaces/Barrel";
import instance from "@/utils/services/ApiService";

export class BarrelRepository {
  private static _uri: string = "/Varil";

  static getBarrelList(workOrderNo: string) {
    return instance.get<IApiGetListResult<IBarrel>>(this._uri, {
      params: { isemriNo: workOrderNo },
    });
  }

  static verifyBarrel(datNo: string, workOrderNo: string) {
    return instance.post(this._uri, {
      datNo,
      isemrino: workOrderNo,
    });
  }
}

export default BarrelRepository;
