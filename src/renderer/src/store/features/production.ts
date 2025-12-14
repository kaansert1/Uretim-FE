import WorkOrderRepository from "@/repositories/WorkOrderRepository";
import { RootState } from "@/store";
import { FireType } from "@/utils/enums/FireType";
import { ProcessType } from "@/utils/enums/ProcessType";
import { ITerazi } from "@/utils/interfaces/Terazi";
import {
  IMinMax,
  IToBeProduced,
  IUygunsuzUrunLine,
} from "@/utils/interfaces/WorkOrder";
import { IncreasedLabel } from "@/utils/interfaces/enums/IncreasedLabel";
import { ProductionType } from "@/utils/interfaces/enums/ProductionType";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

export const fetchMinMaxValue = createAsyncThunk(
  "production/minMax",
  async (workOrder: string) => {
    const { data: result } = (await WorkOrderRepository.getMinMax(workOrder))
      .data;

    return result;
  }
);

export const fetchRemaingValue = createAsyncThunk(
  "production/remaining",
  async (ciid: number) => {
    const { data: result } = (await WorkOrderRepository.getToBeProduced(ciid))
      .data;

    return result;
  }
);

export interface IState {
  loading: ProcessType;
  minMax: IMinMax;
  produced: IToBeProduced;
  terazi: ITerazi;
  productionType: ProductionType;
  fireType?: FireType;
  fireIssue?: IUygunsuzUrunLine;
  isAuth: boolean;
  labelType: IncreasedLabel | null;
}

const initialState: IState = {
  loading: ProcessType.Idle,
  productionType: ProductionType.Uretim,
  isAuth: false,
  labelType: null,
  minMax: {
    birimAgirlik: 0,
    maxad: 0,
    maxkg: 0,
    minad: 0,
    minkg: 0,
    serino: "",
  },
  terazi: {
    adet: 0,
    brut: 0,
    dara: 0,
    gramaj: 0,
    net: 0,
  },
  produced: {
    remaining: 0,
    produced: 0,
    toBeProducedItem: {
      ciid: 0,
      did: 0,
      value: 0,
    },
  },
};

const production = createSlice({
  name: "production",
  initialState,
  reducers: {
    setProductionType: (
      state,
      action: PayloadAction<{
        data: ProductionType;
        fireType?: FireType;
        issue?: IUygunsuzUrunLine;
      }>
    ) => {
      const { data, fireType, issue } = action.payload;
      state.productionType = data;
      state.fireType = fireType;
      state.fireIssue = issue;
    },
    setAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },

    clearScale: (state) => {
      state.terazi = {
        ...state.terazi,
        adet: 0,
        brut: 0,
        dara: 0,
        net: 0,
      };
    },
    setScaleCount: (state, action: PayloadAction<string>) => {
      const val = parseFloat(action.payload);

      // NET = (adet / 1000) * gramaj
      // BRUT = (adet / 1000) * gramaj + dara;
      if (isNaN(val)) {
        state.terazi = {
          ...state.terazi,
          adet: 0,
          brut: 0,
          dara: 0.2, //HUSMEAN
          net: 0,
        };
      } else {
        state.terazi.dara = 0.2; //HUSMEAN
        state.terazi.adet = val;
        state.terazi.net = (state.terazi.adet / 1000) * state.terazi.gramaj;
        state.terazi.brut =
          (state.terazi.adet / 1000) * state.terazi.gramaj + state.terazi.dara;
      }
    },
    setUw: (state, action: PayloadAction<number>) => {
      state.minMax.birimAgirlik = action.payload;
    },
    setScale: (state, action: PayloadAction<{ net: number; dara: number }>) => {
      if (state.productionType != ProductionType.Numune) {
        const { dara, net } = action.payload;

        state.terazi = {
          adet: Math.floor((net * 1000) / state.minMax.birimAgirlik),
          brut: net + dara,
          dara,
          gramaj: state.minMax.birimAgirlik,
          net,
        };
      }
    },
    setLabelType: (state, action: PayloadAction<IncreasedLabel | null>) => {
      state.labelType = action.payload;
    },
    setMinMax: (state, action: PayloadAction<IMinMax>) => {
      const { birimAgirlik, maxad, maxkg, minad, minkg, serino } =
        action.payload;
      state.terazi.gramaj = birimAgirlik;
      state.minMax = {
        birimAgirlik,
        maxad,
        maxkg,
        minad,
        minkg,
        serino,
      };
    },
    resetProduction: (state) => {
      state.loading = ProcessType.Idle;
      state.productionType = ProductionType.Uretim;
      state.isAuth = false;
      state.labelType = null;
      state.fireType = undefined;
      state.fireIssue = undefined;
      state.minMax = {
        birimAgirlik: 0,
        maxad: 0,
        maxkg: 0,
        minad: 0,
        minkg: 0,
        serino: "",
      };
      state.terazi = {
        adet: 0,
        brut: 0,
        dara: 0,
        gramaj: 0,
        net: 0,
      };
      state.produced = {
        remaining: 0,
        produced: 0,
        toBeProducedItem: {
          ciid: 0,
          did: 0,
          value: 0,
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMinMaxValue.fulfilled, (state, action) => {
      const { birimAgirlik, maxad, maxkg, minad, minkg, serino } =
        action.payload;
      state.terazi.gramaj = birimAgirlik;
      state.minMax = {
        birimAgirlik,
        maxad,
        maxkg,
        minad,
        minkg,
        serino,
      };
      state.loading = ProcessType.Succedded;
    });
    builder.addCase(fetchMinMaxValue.pending, (state) => {
      state.loading = ProcessType.Pending;
    });
    builder.addCase(fetchRemaingValue.fulfilled, (state, action) => {
      state.produced = action.payload;
      state.loading = ProcessType.Succedded;
    });
    builder.addCase(fetchRemaingValue.pending, (state) => {
      state.loading = ProcessType.Pending;
    });
  },
});

export default production.reducer;
export const {
  setProductionType,
  setAuth,
  setScale,
  setScaleCount,
  clearScale,
  setMinMax,
  setLabelType,
  setUw,
  resetProduction,
} = production.actions;
export const useProduction = () =>
  useSelector((state: RootState) => state.production);
