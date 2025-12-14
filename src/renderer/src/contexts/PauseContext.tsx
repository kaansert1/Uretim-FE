import DurusRepository from "@/repositories/DurusRepository";
import { useEmployee } from "@/store/features/employee";
import { PauseType } from "@/utils/enums/PauseType";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

type PauseStateType = {
  pauseType: PauseType | null;
  pauseTime: Date | null;
  pauseReason: string | null;
  initialLoad: boolean;
};

type PauseContextType = {
  startBreakdown: (startedAt?: Date) => void;
  startDurus: (startedAt?: Date, reason?: string) => void;
  resetPause: () => void;
} & PauseStateType;

const PauseContext = createContext<PauseContextType | undefined>(undefined);

export const PauseProvider = ({ children }: React.PropsWithChildren) => {
  const [pauseState, setPauseState] = useState<PauseStateType>({
    pauseType: null,
    pauseTime: null,
    pauseReason: null,
    initialLoad: true,
  });

  const { workOrder } = useEmployee();

  const startBreakdown = useCallback((startedAt?: Date) => {
    setPauseState((prev) => ({
      ...prev,
      pauseType: PauseType.Mola,
      pauseTime: startedAt ?? new Date(),
      pauseReason: null,
      initialLoad: false,
    }));
  }, []);

  const startDurus = useCallback((startedAt?: Date, reason?: string) => {
    setPauseState((prev) => ({
      ...prev,
      pauseType: PauseType.Durus,
      pauseTime: startedAt ?? new Date(),
      pauseReason: reason ?? null,
      initialLoad: false,
    }));
  }, []);

  const resetPause = useCallback(() => {
    setPauseState((prev) => ({
      ...prev,
      pauseType: null,
      pauseTime: null,
      pauseReason: null,
      initialLoad: true,
    }));
  }, []);

  useEffect(() => {
    if (!workOrder?.isemrino) {
      return;
    }

    DurusRepository.getMachinePauseControl(workOrder.isemrino).then(
      ({
        data: {
          data: { durus, mola },
        },
      }) => {
        if (durus.isActive && durus.tarih) {
          startDurus(new Date(durus.tarih), durus.reason);
        } else if (mola.isActive && mola.tarih) {
          startBreakdown(new Date(mola.tarih));
        }
        setPauseState((prev) => ({ ...prev, initialLoad: false }));
      }
    );
  }, [workOrder?.isemrino, startDurus, startBreakdown]);

  const contextValue = useMemo(
    () => ({
      ...pauseState,
      startBreakdown,
      startDurus,
      resetPause,
    }),
    [pauseState, startBreakdown, startDurus, resetPause]
  );

  return (
    <PauseContext.Provider value={contextValue}>
      {children}
    </PauseContext.Provider>
  );
};

export const usePause = () => {
  const context = useContext(PauseContext);
  if (!context) {
    throw new Error("usePause must be used within a PauseProvider");
  }
  return context;
};
