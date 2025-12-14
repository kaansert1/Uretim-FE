import {
  IApiGetListResult,
  IApiGetObjectResult,
  IApiGetPaginationListResult,
  IApiPostObjectResult,
  IApiPostResult,
} from "@/utils/interfaces/ApiResult";
import { IIncreasedLabelInfo } from "@/utils/interfaces/IIncreasedLabelInfo";
import { IRemainingMaterial } from "@/utils/interfaces/Material";
import { IProducedItem } from "@/utils/interfaces/ProducedItem";
import { IProducedMaterial } from "@/utils/interfaces/ProducedMaterial";
import { IProductLabel } from "@/utils/interfaces/ProductLabel";
import { IGetProducedItemsDto } from "@/utils/interfaces/dto/GetProducedItemsDto";
import { IIncreasedLabelDto } from "@/utils/interfaces/dto/IncreasedLabelDto";
import { IProductionAddDto } from "@/utils/interfaces/dto/ProducitonAddDto";
import instance from "@/utils/services/ApiService";
import { AxiosResponse } from "axios";

class ProductionRepository {
  private static _uri: string = "/Uretim";

  static async addProduction(data: IProductionAddDto) {
    return instance.post<
      IProductionAddDto,
      AxiosResponse<IApiPostObjectResult<IProductLabel>>
    >(`${this._uri}`, data);
  }

  static async getProducedItems({ workOrder }: IGetProducedItemsDto) {
    return instance.get<IApiGetPaginationListResult<IProducedItem>>(
      `${this._uri}/produced-item?workOrder=${workOrder}`
    );
  }

  static async getProducedMaterials(id: number) {
    return instance.get<IApiGetListResult<IProducedMaterial>>(
      `${this._uri}/produced-materials?uretId=${id}`
    );
  }

  static async getProducedLabel(
    serialNo: string,
    uretTip: number,
    machineType: string
  ) {
    return instance.get<IApiGetObjectResult<IProductLabel>>(
      `${this._uri}/produced-label?serialNo=${serialNo}&uretTip=${uretTip}&macType=${machineType}`
    );
  }

  static async increasedLabelInfo({
    workOrder,
    isBody,
  }: {
    workOrder: string;
    isBody: boolean;
  }) {
    return instance.get<IIncreasedLabelInfo>(
      `${this._uri}/overSupplyInfo?workOrder=${workOrder}&isBody=${isBody}`
    );
  }

  static async increasedLabel(increasedLabelDto: IIncreasedLabelDto) {
    return instance.post<
      IIncreasedLabelDto,
      AxiosResponse<IApiPostObjectResult<IProductLabel>>
    >(`${this._uri}/overSupply`, increasedLabelDto);
  }

  static producedLabelControl(serialNo: string, isemriNo: string) {
    return instance.get<AxiosResponse<IApiPostResult>>(
      `${this._uri}/ProducedLabelControl`,
      {
        params: { serialNo, isemriNo },
      }
    );
  }

  static getRemainingMaterial(isemriNo: string) {
    return instance.get<IRemainingMaterial>(
      `${this._uri}/GetRemainingMaterial`,
      { params: { isemriNo } }
    );
  }
}

export default ProductionRepository;
