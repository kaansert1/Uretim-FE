import BottomButton from "@/components/buttons/BottomButton";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { MdPendingActions } from "react-icons/md";
import React, { useEffect, useState, useCallback } from "react";
import { useEmployee } from "@/store/features/employee";
import { PauseType } from "@/utils/enums/PauseType";
import { PauseModal } from "@/components/modals/PauseModal";
import { Menu, MenuItem, ListItemIcon, ListItemText, Box } from "@mui/material";
import DurusRepository from "@/repositories/DurusRepository";
import PauseBreakdownPasswordModal from "@/components/modals/PauseBreakdownPasswordModal";
import { usePause } from "@/contexts/PauseContext";

export default function PauseButton() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [pauseReasons, setPauseReasons] = useState<string[]>([]);
  const [passwordModal, setPasswordModal] = useState<boolean>(false);

  const { show, AlertModal } = useConfirmModal({
    title: "Makine Duruşu",
    description: `Makineyi ${
      selectedReason ? selectedReason : ""
    } sebebiyle durdurmak istediğinize emin misiniz?`,
  });

  const { workOrder, employee } = useEmployee();
  const { startDurus, pauseType, resetPause } = usePause();

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleReasonSelect = useCallback(
    (reason: string) => {
      setSelectedReason(reason);
      handleClose();
      show().then(() => {
        DurusRepository.createMachinePause({
          isemrino: workOrder?.isemrino ?? "",
          personelId: parseInt(employee?.staffCode ?? "0"),
          durusNedeni: reason,
          baslangicTarihi: new Date().toISOString(), // Backend kendi saatini kullanacak, bu sadece placeholder
        }).then(() => {
          startDurus(new Date(), reason); // Frontend timer için local time
        });
      });
    },
    [handleClose, show, workOrder?.isemrino, employee?.staffCode, startDurus]
  );

  const handleResume = useCallback(() => {
    DurusRepository.resumeMachinePause({
      isemrino: workOrder?.isemrino ?? "",
      bitisTarihi: new Date().toISOString(), // Backend kendi saatini kullanacak, bu sadece placeholder
    }).then(() => {
      resetPause();
    });
  }, [workOrder?.isemrino, resetPause]);

  const handleShowPasswordModal = useCallback(() => {
    setPasswordModal(true);
  }, []);

  const handleClosePasswordModal = useCallback(() => {
    setPasswordModal(false);
  }, []);

  useEffect(() => {
    DurusRepository.getMachinePauseReasonList().then((res) => {
      setPauseReasons(res.data.data);
    });
  }, []);

  return (
    <React.Fragment>
      <BottomButton
        disabled={pauseType === PauseType.Durus}
        color="warning"
        icon={<MdPendingActions size={24} />}
        onClick={handleClick}
      >
        Duruş
      </BottomButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: 600,
              maxHeight: 600,
              overflowY: "auto",
              "& .MuiMenuItem-root": {
                fontSize: "1.2rem",
                padding: "16px 20px",
                height: "auto",
                minHeight: "60px",
                whiteSpace: "normal",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.08)",
                },
                "& .MuiListItemIcon-root": {
                  minWidth: "40px",
                },
              },
            },
          },
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Box sx={{ p: 1, display: "flex", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            {pauseReasons.map((reason, index) => {
              if (index % 2 === 0) {
                return (
                  <MenuItem
                    key={reason}
                    onClick={() => handleReasonSelect(reason)}
                  >
                    <ListItemIcon>
                      <MdPendingActions size={20} />
                    </ListItemIcon>
                    <ListItemText>{reason}</ListItemText>
                  </MenuItem>
                );
              }
              return null;
            })}
          </Box>
          <Box sx={{ flex: 1 }}>
            {pauseReasons.map((reason, index) => {
              if (index % 2 === 1) {
                return (
                  <MenuItem
                    key={reason}
                    onClick={() => handleReasonSelect(reason)}
                  >
                    <ListItemIcon>
                      <MdPendingActions size={20} />
                    </ListItemIcon>
                    <ListItemText>{reason}</ListItemText>
                  </MenuItem>
                );
              }
              return null;
            })}
          </Box>
        </Box>
      </Menu>

      <AlertModal />

      {pauseType === PauseType.Durus && (
        <PauseModal open={true} onResume={handleShowPasswordModal} />
      )}

      {passwordModal && (
        <PauseBreakdownPasswordModal
          open={passwordModal}
          onClose={handleClosePasswordModal}
          onSuccess={handleResume}
          type="breakdown"
        />
      )}
    </React.Fragment>
  );
}
