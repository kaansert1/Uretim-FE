import {
  ISendMailDto,
  ISendMailDtoV2,
} from "@/utils/interfaces/dto/SendMailDto";
import instance from "@/utils/services/ApiService";
import { AxiosResponse } from "axios";

class MailRepository {
  private static _uri: string = "/mail";

  static send(data: ISendMailDto) {
    return instance.post<ISendMailDto, AxiosResponse<boolean>>(
      `${this._uri}`,
      data
    );
  }

  static sendAsync(data: ISendMailDtoV2) {
    return instance.post<ISendMailDtoV2, AxiosResponse<boolean>>(
      `${this._uri}/SendMailAsyncV2`,
      data
    );
  }
}

export default MailRepository;
