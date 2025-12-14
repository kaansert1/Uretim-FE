import { useState } from "react";
import ConfirmAlertModal from "../components/modals/ConfirmAlertModal";
import { DialogProps } from "@mui/material";
interface ConfirmState {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

interface ConfirmModalProps {
  title: string;
  description: string;
  maxWidth?: DialogProps["maxWidth"];
}

export const useConfirmModal = ({
  title,
  description,
  maxWidth = "sm",
}: ConfirmModalProps) => {
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    open: false,
    onConfirm: () => {},
    onCancel: () => {},
  });

  const show = () => {
    return new Promise((resolve, reject) => {
      setConfirmState({
        open: true,
        onConfirm: () => {
          setConfirmState({ ...confirmState, open: false });
          resolve(true);
        },
        onCancel: () => {
          setConfirmState({ ...confirmState, open: false });
          reject(false);
        },
      });
    });
  };

  const AlertModal = () => {
    return (
      <ConfirmAlertModal
        fullWidth
        maxWidth={maxWidth}
        open={confirmState.open}
        onClose={() => setConfirmState({ ...confirmState, open: false })}
        title={title}
        description={description}
        onConfirm={confirmState.onConfirm}
        onCancel={confirmState.onCancel}
      />
    );
  };

  return {
    show,
    AlertModal,
  };
};
