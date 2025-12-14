import {
  Button,
  Dialog,
  DialogContent,
  ModalProps,
  Typography,
  Box,
  Paper,
  Stack,
  IconButton,
} from "@mui/material";

import { useEmployee } from "@/store/features/employee";
import { useCountdown } from "@/hooks/useCountdown";
import { useEffect, useMemo } from "react";
import { PauseType } from "@/utils/enums/PauseType";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { MdClose } from "react-icons/md";
import PersonIcon from "@mui/icons-material/Person";
import { usePause } from "@/contexts/PauseContext";
interface PauseModalProps extends Omit<ModalProps, "children"> {
  onResume: () => void;
  onChangeEmployee?: () => void;
}

export const PauseModal = ({
  open,
  onClose,
  onResume,
  onChangeEmployee,
}: PauseModalProps) => {
  const { previousEmployee } = useEmployee();
  const { pauseType, pauseTime, pauseReason } = usePause();

  const { start, timeLeft } = useCountdown();

  useEffect(() => {
    if (pauseTime) {
      start(pauseTime);
    }
  }, [pauseTime, start]);

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClose && pauseType === PauseType.Mola && previousEmployee) {
      onClose(event, "backdropClick");
    }
  };

  const handleResume = () => {
    onResume();
  };

  const modalTitle = useMemo(() => {
    return pauseType === PauseType.Mola
      ? "Mola Başlatıldı"
      : "Duruş Başlatıldı";
  }, [pauseType]);

  const modalDescription = useMemo(() => {
    return `${
      pauseType === PauseType.Mola ? "Molayı" : "Duruşu"
    } bitirmek için "Bitir" tuşuna basınız.`;
  }, [pauseType]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        },
      }}
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(4px)",
          },
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          backgroundColor: (theme) => theme.palette.primary.main,
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography
          variant="h5"
          color="white"
          fontWeight={600}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {modalTitle}

          {pauseType === PauseType.Mola && previousEmployee && (
            <IconButton onClick={handleClose} color="inherit">
              <MdClose />
            </IconButton>
          )}
        </Typography>

        <Typography
          variant="h6"
          color="white"
          fontWeight={600}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {pauseReason}
        </Typography>

        <Typography
          variant="body1"
          color="white"
          sx={{
            textAlign: "center",
            opacity: 0.9,
            maxWidth: "80%",
          }}
        >
          {modalDescription}
        </Typography>
      </Box>

      <DialogContent sx={{ p: 4 }}>
        <Stack spacing={4} alignItems="center">
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: (theme) => theme.palette.primary.light,
              width: "100%",
              textAlign: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              color="primary.contrastText"
              sx={{ mb: 1, opacity: 0.9 }}
            >
              Geçen Süre
            </Typography>
            <Typography
              variant="h3"
              color="primary.contrastText"
              fontWeight={600}
              sx={{
                fontFamily: "monospace",
                letterSpacing: 2,
              }}
            >
              {timeLeft}
            </Typography>
          </Paper>



          <Stack spacing={2} sx={{ width: "100%" }}>
            {onChangeEmployee && (
              <Button
                variant="outlined"
                color="primary"
                size="large"
                fullWidth
                onClick={onChangeEmployee}
                sx={{
                  height: 56,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                  borderWidth: 2,
                  "&:hover": {
                    borderWidth: 2,
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
                startIcon={<PersonIcon sx={{ fontSize: 28 }} />}
              >
                Personel Değiştir
              </Button>
            )}

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleResume}
              sx={{
                height: 64,
                fontSize: "1.2rem",
                fontWeight: 600,
                borderRadius: 2,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                background: (theme) =>
                  `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                "&:hover": {
                  background: (theme) =>
                    `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease-in-out",
              }}
              endIcon={<StopCircleIcon sx={{ fontSize: 32 }} />}
            >
              Bitir
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
