import { useCountdown } from "@/hooks/useCountdown";
import { useEmployee } from "@/store/features/employee";
import {
  Snackbar,
  Alert,
  SnackbarProps,
  AlertTitle,
  Chip,
  IconButton,
} from "@mui/material";
import { Person, AccessTime, Fullscreen } from "@mui/icons-material";
import { useEffect } from "react";
import { usePause } from "@/contexts/PauseContext";
interface BreakdownSnackbarModalProps extends SnackbarProps {
  onExpand: () => void;
}

export default function BreakdownSnackbarModal({
  ...props
}: BreakdownSnackbarModalProps) {
  const { employee } = useEmployee();
  const { start, timeLeft } = useCountdown();
  const { pauseTime } = usePause();

  useEffect(() => {
    if (pauseTime) {
      start(pauseTime);
    }
  }, [pauseTime, start]);

  return (
    <Snackbar
      open={props.open}
      onClose={props.onClose}
      onClick={props.onExpand}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Alert
        severity="info"
        variant="filled"
        sx={{
          width: "100%",
          maxWidth: 300,
          "&:hover": {
            cursor: "pointer",
          },
        }}
      >
        <AlertTitle
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          Mola Devam Ediyor
          <IconButton color="inherit" onClick={props.onExpand}>
            <Fullscreen />
          </IconButton>
        </AlertTitle>

        <Chip
          label={`${employee?.firstName} ${employee?.lastName}`}
          icon={<Person />}
          color="secondary"
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.1)",
            fontWeight: 600,
          }}
        />
        <Chip
          label={timeLeft}
          icon={<AccessTime />}
          color="secondary"
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.1)",
            fontWeight: 600,
            mt: 1,
          }}
        />
      </Alert>
    </Snackbar>
  );
}
