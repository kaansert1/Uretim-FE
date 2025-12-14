import { IApiPostResult } from "@/utils/interfaces/ApiResult";
import {
  ChangePausePersonelDto,
  CreatePauseDto,
  ResumePauseDto,
} from "@/utils/interfaces/Pause";
import instance from "@/utils/services/ApiService";
import { AxiosResponse } from "axios";

class PauseRepository {
  private static _uri: string = "/Mola";

  static createPause(data: CreatePauseDto) {
    return instance.post<CreatePauseDto, AxiosResponse<IApiPostResult>>(
      `${this._uri}/Create`,
      data
    );
  }

  static changePausePersonel(data: ChangePausePersonelDto) {
    return instance.post<ChangePausePersonelDto, AxiosResponse<IApiPostResult>>(
      `${this._uri}/VekilPersonel`,
      data
    );
  }

  static resumePause(data: ResumePauseDto) {
    return instance.post<ResumePauseDto, AxiosResponse<IApiPostResult>>(
      `${this._uri}/MolaBitir`,
      data
    );
  }
}

export default PauseRepository;
