import { IRpArızaChecklist } from "@/utils/interfaces/RpArızaChecklist";
import instance from "@/utils/services/ApiService";

class RpArızaChecklistRepository {
  private static _uri: string = "/RpArızaChecklist";

  static getList() {
    return instance.get<IRpArızaChecklist[]>(this._uri);
  }
}

export default RpArızaChecklistRepository;
