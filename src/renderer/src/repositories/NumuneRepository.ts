import instance from "@/utils/services/ApiService";
import { IApiGetObjectResult } from "@/utils/interfaces/ApiResult";
import { INumuneScheduleResponse } from "@/utils/interfaces/Numune";

class NumuneRepository {
  private static _uri: string = "/Numune";

  static async getNumuneSchedule(isemri: string) {
    return instance.get<IApiGetObjectResult<INumuneScheduleResponse>>(
      `${this._uri}/NumuneList`,
      {
        params: {
          isemri,
        },
      }
    );
  }
}

export default NumuneRepository;
