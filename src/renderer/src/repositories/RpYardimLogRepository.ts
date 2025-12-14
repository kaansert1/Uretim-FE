import { IApiPostResult } from "@/utils/interfaces/ApiResult";
import { IRpYardimLog, IRpYardimLogUpdateDto } from "@/utils/interfaces/RpYardimLog";
import instance from "@/utils/services/ApiService";
import { AxiosResponse } from "axios";

export interface IRpYardimLogDto {
  isEmriNo: string;
  personelID: string;
  machineCode?: string; // Yeni eklenen makine kodu
  hata?: string;
}

class RpYardimLogRepository {
  private static _uri: string = "/RpYardimLog";

  static create(data: IRpYardimLogDto) {
    return instance.post<IRpYardimLogDto, AxiosResponse<IApiPostResult>>(
      this._uri,
      data
    );
  }

  static getList(machineCode?: string) {
    // GetResponseOnlyResultData direkt array döndürür, wrap etmez
    const params = machineCode ? `?machineCode=${machineCode}` : '';
    return instance.get<IRpYardimLog[]>(`${this._uri}${params}`);
  }

  static getCount(machineCode?: string) {
    // GetResponseOnlyResultData direkt data döndürür, wrap etmez
    const params = machineCode ? `?machineCode=${machineCode}` : '';
    return instance.get<number>(`${this._uri}/count${params}`);
  }

  static async update(id: number, data: IRpYardimLogUpdateDto) {
    console.log("🔍 GET Update Request:", `${this._uri}`, data);

    // GET parametrelerine çevir
    const params = new URLSearchParams({
      updateId: id.toString()
    });

    // Data'ya göre action belirle
    if (data.CevapTarihi && !data.CözümTarihi) {
      params.append('action', 'answer');
      if (data.CevapPersonel) {
        params.append('cevapPersonel', data.CevapPersonel);
      }
    } else if (data.CözümTarihi) {
      params.append('action', 'resolve');
      if (data.Cevap) {
        params.append('cevap', data.Cevap);
      }
    }

    return instance.get<{success: boolean, message: string}>(
      `${this._uri}?${params.toString()}`
    );
  }

  // Yardım isteğini cevaplanmış olarak işaretle (GET method)
  static async markAsAnswered(id: number, cevapPersonel?: string) {
    console.log("🔍 markAsAnswered GET request:", id, cevapPersonel);
    const params = new URLSearchParams({
      updateId: id.toString(),
      action: 'answer',
      cevapPersonel: cevapPersonel || 'Sistem'
    });

    return instance.get<{success: boolean, message: string}>(
      `${this._uri}?${params.toString()}`
    );
  }

  // Yardım isteğini çözülmüş olarak işaretle (GET method)
  static async markAsResolved(id: number) {
    console.log("🔍 markAsResolved GET request:", id);
    const params = new URLSearchParams({
      updateId: id.toString(),
      action: 'resolve'
    });

    return instance.get<{success: boolean, message: string}>(
      `${this._uri}?${params.toString()}`
    );
  }

  // Yardım isteğini seçilen arızalarla birlikte çözülmüş olarak işaretle (GET method)
  static async markAsResolvedWithArızalar(id: number, selectedArızalar: string[]) {
    console.log("🔍 markAsResolvedWithArızalar GET request:", id, selectedArızalar);
    const params = new URLSearchParams({
      updateId: id.toString(),
      action: 'resolve',
      cevap: JSON.stringify(selectedArızalar)
    });

    return instance.get<{success: boolean, message: string}>(
      `${this._uri}?${params.toString()}`
    );
  }

  // PUT metodları kaldırıldı - Sadece GET metodları kullanılıyor
}

export default RpYardimLogRepository;
