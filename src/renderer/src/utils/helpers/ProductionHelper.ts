import store from "@/store";
import { ProductionType } from "../interfaces/enums/ProductionType";
import {
  clearScale,
  fetchMinMaxValue,
  fetchRemaingValue,
  setAuth,
  setLabelType,
  setProductionType,
} from "@/store/features/production";
import ToastHelper from "./ToastHelper";
import { MESSAGES } from "../constants";
import { IWorkOrder } from "../interfaces/WorkOrder";

class ProductionHelper {
  static isMontage = (val: string) => {
    return val !== "E";
  };

  static changeProductionType(data: ProductionType) {
    /*(_, datax: { data: ProductionType; fireType?: string }) => {
			datax.data = data;
			datax.fireType = fireType;
			store.dispatch(setProductionType(datax));
		}*/
    //store.dispatch(setProductionType(productionType, fireType));

    /* const action = {
			type: 'production/setProductionType', 
			payload: {
				productionType: data,
				fireType: fireType
			}
		}; */
    store.dispatch(setProductionType({ data }));
  }

  static login(
    password: string,
    productionType: ProductionType,
    yapKod?: string
  ): boolean {
    if (password === "1") {
      productionType !== ProductionType.Fire &&
        this.changeProductionType(productionType);
      store.dispatch(setAuth(true));
      return true;
    }

    ToastHelper.error(MESSAGES["invalid-password"]);
    this.changeProductionType(ProductionType.Uretim);
    store.dispatch(setAuth(false));

    return false;
  }

  static successProduction(workOrder: IWorkOrder | null) {
    if (workOrder !== null) {
      store.dispatch(
        setProductionType({
          data: ProductionType.Uretim,
          fireType: undefined,
          issue: undefined,
        })
      );
      // store.dispatch(
      // 	setProductionType(
      // 		ProductionHelper.isRenkGecisi(workOrder.yapkod ?? '')
      // 			? ProductionType.RenkGecisi
      // 			: ProductionType.Uretim
      // 	)
      // );
      store.dispatch(setLabelType(null));
    }
  }

  static getProductionName(val: number) {
    let name: string = "";

    switch (val) {
      case 1:
        return (name = "Numune");
      case 2:
        return (name = "Fire");
      case 3:
        return (name = "Renk Geçişi");
      case 5:
        return (name = "Yarım Koli");
      case 9:
        return (name = "Artan Etiket");
    }
    return name;
  }

  static isRenkGecisi(yapKod: string) {
    if (yapKod.toLowerCase().includes("rg")) return true;

    return false;
  }
}
export default ProductionHelper;
