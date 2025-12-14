import {
  IApiGetListResult,
  IApiGetObjectResult,
} from "@/utils/interfaces/ApiResult";
import instance from "@/utils/services/ApiService";
import {
  MachinePauseDto,
  MachineResumeDto,
  MachineStatusDto,
} from "@/utils/interfaces/Pause";
import { AxiosResponse } from "axios";
import { IApiPostResult } from "@/utils/interfaces/ApiResult";

class DurusRepository {
  private static _uri: string = "/Durus";

  static getMachinePauseReasonList() {
    return instance.get<IApiGetListResult<string>>(`${this._uri}/List`);
  }

  static getMachinePauseControl(workOrder: string) {
    return instance.get<IApiGetObjectResult<MachineStatusDto>>(
      `${this._uri}/PauseControl?isemrino=${workOrder}`
    );
  }

  static createMachinePause(data: MachinePauseDto) {
    return instance.post<MachinePauseDto, AxiosResponse<IApiPostResult>>(
      `${this._uri}/SetMachineToPassive`,
      data
    );
  }

  static resumeMachinePause(data: MachineResumeDto) {
    return instance.post<MachineResumeDto, AxiosResponse<IApiPostResult>>(
      `${this._uri}/SetMachineToActive`,
      data
    );
  }
}

export default DurusRepository;
