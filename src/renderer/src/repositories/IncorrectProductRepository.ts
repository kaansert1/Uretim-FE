import { IApiPostResult } from "@/utils/interfaces/ApiResult";
import { IIncorrectProductDto } from "@/utils/interfaces/dto/IncorrectProductDto";
import instance from "@/utils/services/ApiService";
import { AxiosResponse } from "axios";

class IncorrectRepository {
  private static _uri: string = "/Uretim/unsuitable";

  static sendIncorrect(incorrectProductDto: IIncorrectProductDto) {
    return instance.post<IIncorrectProductDto, AxiosResponse<IApiPostResult>>(
      `${this._uri}`,
      incorrectProductDto
    );
  }
}

export default IncorrectRepository;
