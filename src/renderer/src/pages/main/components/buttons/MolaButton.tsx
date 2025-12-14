import BottomButton from "@/components/buttons/BottomButton";
import React, { useState, useEffect, useCallback } from "react";
import { MdAlarm } from "react-icons/md";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import {
  useEmployee,
  changeEmployee as changeEmployeeAction,
  resetEmployee,
} from "@/store/features/employee";
import { PauseType } from "@/utils/enums/PauseType";
import store from "@/store";
import BreakdownSnackbarModal from "@/components/modals/BreakdownSnacbarkModal";
import { PauseModal } from "@/components/modals/PauseModal";
import SelectEmployeeModal from "@/components/modals/SelectEmployeeModal";
import PauseRepository from "@/repositories/PauseRepository";
import PauseBreakdownPasswordModal from "@/components/modals/PauseBreakdownPasswordModal";
import { usePause } from "@/contexts/PauseContext";

export default function MolaButton() {
  const [showChangeEmployee, setShowChangeEmployee] = useState<boolean>(false);
  const [expanded, setExpanded] = useState(false);
  const [passwordModal, setPasswordModal] = useState<boolean>(false);

  const { workOrder, employee } = useEmployee();

  const { startBreakdown, pauseType, resetPause, initialLoad } = usePause();

  const { show, AlertModal } = useConfirmModal({
    title: "Mola",
    description: "Mola yapmak istediğinize emin misiniz?",
  });

  const handleClick = useCallback(() => {
    show().then(() => {
      PauseRepository.createPause({
        personelId: Number(employee?.staffCode) ?? 0,
        baslangic: new Date().toISOString(), // Backend kendi saatini kullanacak, bu sadece placeholder
        isemrino: workOrder?.isemrino ?? "",
      }).then(() => {
        setExpanded(true);
        startBreakdown(new Date()); // Frontend timer için local time
      });
    });
  }, [show, employee?.staffCode, workOrder?.isemrino, startBreakdown]);

  const handleResume = useCallback(() => {
    PauseRepository.resumePause({
      isemrino: workOrder?.isemrino ?? "",
      bitis: new Date().toISOString(), // Backend kendi saatini kullanacak, bu sadece placeholder
    }).then(() => {
      store.dispatch(resetEmployee());
      resetPause();
      setExpanded(false);
    });
  }, [workOrder?.isemrino, resetPause]);

  const handleCloseExpanded = useCallback(() => {
    setExpanded(false);
  }, []);

  const handleShowPasswordModal = useCallback(() => {
    setPasswordModal(true);
  }, []);

  const handleShowChangeEmployee = useCallback(() => {
    setShowChangeEmployee(true);
  }, []);

  const handleCloseChangeEmployee = useCallback(() => {
    setShowChangeEmployee(false);
  }, []);

  const handlePersonelChanged = useCallback(() => {
    setExpanded(false);
  }, []);

  const handleClosePasswordModal = useCallback(() => {
    setPasswordModal(false);
  }, []);

  const handleExpand = useCallback(() => {
    setExpanded(true);
  }, []);

  useEffect(() => {
    if (pauseType === PauseType.Mola) {
      setExpanded(true);
    }
  }, [pauseType]);

  useEffect(() => {
    if (initialLoad && pauseType === PauseType.Mola) {
      setExpanded(true);
    }
  }, [initialLoad, pauseType]);

  return (
    <React.Fragment>
      <BottomButton
        disabled={pauseType === PauseType.Mola}
        color="secondary"
        icon={<MdAlarm size={28} />}
        onClick={handleClick}
      >
        Mola
      </BottomButton>
      <AlertModal />

      {expanded && (
        <PauseModal
          open={expanded}
          onClose={handleCloseExpanded}
          onResume={handleShowPasswordModal}
          onChangeEmployee={handleShowChangeEmployee}
        />
      )}

      {pauseType === PauseType.Mola && (
        <BreakdownSnackbarModal
          open={true}
          onExpand={handleExpand}
          onClose={() => {}}
        />
      )}

      {showChangeEmployee && (
        <SelectEmployeeModal
          open={showChangeEmployee}
          onClose={handleCloseChangeEmployee}
          onPersonelChanged={handlePersonelChanged}
        />
      )}

      {passwordModal && (
        <PauseBreakdownPasswordModal
          open={passwordModal}
          onClose={handleClosePasswordModal}
          onSuccess={handleResume}
          type="mola"
        />
      )}
    </React.Fragment>
  );
}
