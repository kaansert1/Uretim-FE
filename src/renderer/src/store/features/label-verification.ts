import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import store, { RootState } from "@/store";

export type LabelVerificationState = {
  isOpen: boolean;
  serialNumber: string;
};

const initialState: LabelVerificationState = {
  isOpen: false,
  serialNumber: "",
};

export const labelVerification = createSlice({
  name: "label-verification",
  initialState,
  reducers: {
    open: (state, action: PayloadAction<string>) => {
      state.isOpen = true;
      state.serialNumber = action.payload;
    },
    close: (state) => {
      state.isOpen = false;
      state.serialNumber = "";
    },
    reset: (state) => {
      state.isOpen = false;
      state.serialNumber = "";
    },
  },
});

export default labelVerification.reducer;

export const useLabelVerification = () =>
  useSelector((state: RootState) => state.labelVerification);

// ACTIONS

export const closeLabelVerificationModal = () =>
  store.dispatch(labelVerification.actions.close());
export const openLabelVerificationModal = (serialNumber: string) =>
  store.dispatch(labelVerification.actions.open(serialNumber));
