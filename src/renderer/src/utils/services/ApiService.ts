import store from "@/store";
import { _add, _remove, set as setLoader } from "@/store/features/loader";
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import ToastHelper from "../helpers/ToastHelper";
import { IApiErrorResult } from "../interfaces/ApiResult";
import AutoFixService from "@/services/autoFixService";

declare module "axios" {
  export interface AxiosRequestConfig {
    loader?: boolean;
  }
}

const instance = axios.create({
  baseURL: "http://192.168.2.251:7777/api", // Backend API adresi
});

// Otomatik hata giderme fonksiyonu
const handleAutoFix = async (errorMessage: string) => {
  try {
    const machine = store.getState().employee.machine;

    if (!machine) {
      console.warn("AutoFix - Makine bilgisi bulunamadı, otomatik düzeltme yapılamıyor");
      return;
    }

    // Hata mesajını analiz et
    const analysis = AutoFixService.analyzeError(errorMessage, machine.id);

    if (analysis.canAutoFix) {
      console.info("AutoFix - Kırma serisi hatası tespit edildi, otomatik düzeltme başlatılıyor:", analysis.stokKodu);

      try {
        const result = await AutoFixService.autoFix(errorMessage, machine.id);

        if (result.success) {
          console.info("AutoFix - Düzeltme başarılı:", `Makine: ${machine.machineCode}, Stok: ${analysis.stokKodu}, Mesaj: ${result.data.message}`);
        } else {
          console.error("AutoFix - Düzeltme başarısız:", result.message);
        }
      } catch (autoFixError) {
        console.error("AutoFix - Düzeltme hatası:", autoFixError);
      }
    }
    // Otomatik düzeltme mevcut olmayan hatalar için log yazmıyoruz (spam önlemek için)
  } catch (error) {
    console.error("AutoFix - Analiz hatası:", error);
  }
};

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    store.dispatch(_add(config?.url ?? ""));

    if (config.loader !== false) {
      store.dispatch(setLoader(true));
    }

    const machine = store.getState().employee.machine;

    if (machine) {
      config.headers["machineId"] = machine.machineCode;
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (res: AxiosResponse) => {
    store.dispatch(_remove(res.config?.url ?? ""));
    if (res.config.loader !== false) {
      store.dispatch(setLoader(false));
    }
    return res;
  },
  async (err: AxiosError<IApiErrorResult>) => {
    // API yanıtını kontrol et
    if (err.response) {
      const errorMessage = err.response.data.message;

      // Hata mesajı varsa işle
      if (errorMessage) {
        // Deadlock hatası kontrolü
        if (errorMessage.toLowerCase().includes("deadlock")) {
          ToastHelper.error("Lütfen üretimi tekrar deneyiniz.");
        } else {
          console.log("API Hatası:", err.response);

          // Otomatik hata giderme kontrolü
          await handleAutoFix(errorMessage);

          ToastHelper.error(errorMessage || "Bir hata meydana geldi");
        }
      }
    } else {
      ToastHelper.error(err.message);
    }

    // Yükleme durumunu temizle
    store.dispatch(_remove(err.config?.url ?? ""));
    if (err.config?.loader !== false) {
      store.dispatch(setLoader(false));
    }
    return Promise.reject(err);
  }
);

export default instance;
