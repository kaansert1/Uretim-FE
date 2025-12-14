import { createContext, useContext, useEffect, useState } from "react";
import { useEmployee } from "@/store/features/employee";
import moment from "moment";
import { NumuneWarningModal } from "@/components/modals/NumuneWarningModal";
import { useProduction } from "@/store/features/production";
import { ProductionType } from "@/utils/interfaces/enums/ProductionType";
import store from "@/store";
import { setProductionType } from "@/store/features/production";

type NumuneContextType = {
  isMandatory: boolean;
  setIsMandatory: (isMandatory: boolean) => void;
  infoModal: boolean;
  setInfoModal: (infoModal: boolean) => void;
  setLastNumuneTime: (lastNumuneTime: Date | null) => void;
  lastNumuneTime: Date | null;
};

export const NumuneContext = createContext<NumuneContextType | undefined>(
  undefined
);

const schedule = [
  "08:00:00",
  "11:00:00",
  "16:00:00",
  "20:00:00",
  "23:00:00",
  "04:00:00",
];

const isInNumuneTime = (currentTime: Date = new Date()): boolean => {
  const currentMoment = moment(currentTime);
  const currentTimeStr = currentMoment.format("HH:mm:ss");

  return schedule.includes(currentTimeStr);
};

export const NumuneProvider = ({ children }: React.PropsWithChildren) => {
  const [isMandatory, setIsMandatory] = useState<boolean>(false);
  const [infoModal, setInfoModal] = useState<boolean>(false);
  const [lastNumuneTime, setLastNumuneTime] = useState<Date | null>(null);

  const { productionType } = useProduction();

  useEffect(() => {
    const checkNumuneTime = () => {
      if (isInNumuneTime() && !isMandatory) {
        setInfoModal(true);
        setIsMandatory(true);
      }
    };

    checkNumuneTime();

    const interval = setInterval(() => {
      checkNumuneTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [isMandatory]);

  useEffect(() => {
    if (isMandatory && productionType !== ProductionType.Numune) {
      store.dispatch(setProductionType({ data: ProductionType.Numune }));
    }
  }, [isMandatory]);

  return (
    <NumuneContext.Provider
      value={{
        isMandatory,
        setIsMandatory,
        infoModal,
        setInfoModal,
        lastNumuneTime,
        setLastNumuneTime,
      }}
    >
      {children}

      {infoModal && <NumuneWarningModal />}
    </NumuneContext.Provider>
  );
};

export const useNumuneContext = () => {
  const context = useContext(NumuneContext);

  if (!context)
    throw new Error("useNumuneContext must be used within a NumuneContext");
  return context;
};
