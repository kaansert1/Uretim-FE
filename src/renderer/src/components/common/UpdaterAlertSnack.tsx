import {
  Alert,
  AlertTitle,
  LinearProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function UpdaterAlertSnack() {
  const [version, setVersion] = useState<string | null>("");
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [percent, setPercent] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      "update-available",
      async (_, updateVersion: string) => {
        setVersion(updateVersion);
        setIsAvailable(true);
      }
    );
    window.electron.ipcRenderer.on("update-not-available", async () => {
      setVersion(null);
      setIsAvailable(false);
    });
    window.electron.ipcRenderer.on(
      "download-progress",
      (_, percentValue: number) => {
        setPercent(percentValue);
      }
    );
    window.electron.ipcRenderer.on("error", (_, message: string) => {
      setIsAvailable(true);
      setError(message);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners("update-available");
      window.electron.ipcRenderer.removeAllListeners("update-not-available");
      window.electron.ipcRenderer.removeAllListeners("download-progress");
      window.electron.ipcRenderer.removeAllListeners("error");
    };
  }, []);

  return (
    <Snackbar
      open={isAvailable}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
    >
      <Alert
        sx={{ width: "100%", minWidth: 400, maxWidth: 800 }}
        variant="standard"
        severity={Boolean(error) ? "error" : "info"}
      >
        <AlertTitle>
          Versiyon Güncelleme -{" "}
          {Boolean(error) ? "Hata!" : `Versiyon (${version})`}
        </AlertTitle>

        {(Boolean(error) && (
          <Typography variant="body2" fontWeight="600">
            Hata: {error}
          </Typography>
        )) || (
          <>
            <Typography variant="subtitle2" fontWeight="600">
              {percent}%
            </Typography>
            <LinearProgress value={percent} variant="determinate" />
          </>
        )}
      </Alert>
    </Snackbar>
  );
}
