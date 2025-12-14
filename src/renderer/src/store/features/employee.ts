import { IEmployee } from "@/utils/interfaces/Employee";
import { IMachine } from "@/utils/interfaces/Machine";
import { IWorkOrder } from "@/utils/interfaces/WorkOrder";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { PauseType } from "@/utils/enums/PauseType";
import DurusRepository from "@/repositories/DurusRepository";

export interface IState {
  previousEmployee: IEmployee | null;
  employee: IEmployee | null;
  machine: IMachine | null;
  workOrder: IWorkOrder | null;
  isLoggedIn: boolean;
  isPaused: boolean;
  pauseType: PauseType | null;
  pauseTime: Date | null;
  pauseReason: string | null;
}

const initialState: IState = {
  previousEmployee: null,
  employee: null,
  machine: null,
  workOrder: null,
  isLoggedIn: false,
  isPaused: false,
  pauseTime: null,
  pauseType: null,
  pauseReason: null,
};

export const getMachinePauseControl = createAsyncThunk(
  "employee/getMachinePauseControl",
  async (workOrder: string) => {
    const response = await DurusRepository.getMachinePauseControl(workOrder);
    return response.data.data;
  }
);

const employee = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setEmployee: (state, action: PayloadAction<IEmployee | null>) => {
      state.employee = action.payload;
    },
    setMachine: (state, action: PayloadAction<IMachine | null>) => {
      state.machine = action.payload;
    },
    setWorkOrder: (state, action: PayloadAction<IWorkOrder | null>) => {
      state.workOrder = action.payload;
    },
    login: (state) => {
      state.isLoggedIn = true;
    },
    pause: (
      state,
      action: PayloadAction<{ date: Date; type: PauseType; reason?: string }>
    ) => {
      state.isPaused = true;
      state.pauseTime = action.payload.date;
      state.pauseType = action.payload.type;
      state.pauseReason = action.payload.reason ?? null;
    },
    resume: (state) => {
      state.isPaused = false;
      state.pauseTime = null;
      state.pauseType = null;
      state.pauseReason = null;
    },
    changeEmployee: (state, action: PayloadAction<IEmployee>) => {
      state.previousEmployee = state.employee;
      state.employee = action.payload;
    },
    resetEmployee: (state) => {
      if (state.previousEmployee) {
        state.employee = state.previousEmployee;
        state.previousEmployee = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMachinePauseControl.fulfilled, (state, action) => {
      const { durus, mola } = action.payload;

      if (durus.isActive) {
        state.isPaused = true;
        state.pauseType = PauseType.Durus;
        state.pauseTime = new Date(durus.tarih ?? "");
      } else if (mola.isActive) {
        state.isPaused = true;
        state.pauseType = PauseType.Mola;
        state.pauseTime = new Date(mola.tarih ?? "");
      }
    });
  },
});

export default employee.reducer;
export const {
  setEmployee,
  setMachine,
  setWorkOrder,
  login,
  pause,
  resume,
  changeEmployee,
  resetEmployee,
} = employee.actions;
export const useEmployee = () =>
  useSelector((state: RootState) => state.employee);
