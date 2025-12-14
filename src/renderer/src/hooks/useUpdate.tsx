import { useEffect, useState } from "react";

export default function useUpdate() {
  const [available, setAvailable] = useState<boolean>(false);
  const [percent, setPercent] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.electron.ipcRenderer.on("update-available", (_, data: boolean) => {
      setAvailable(data);
    });

    window.electron.ipcRenderer.on("update-progress", (_, data: number) => {
      console.log(data);
      setPercent(data ?? 0);
    });

    window.electron.ipcRenderer.on("update-error", (_, data: string) => {
      console.log("ERROR", data);
      setError(data ?? null);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners("update-available");
      window.electron.ipcRenderer.removeAllListeners("update-progress");
      window.electron.ipcRenderer.removeAllListeners("update-error");
    };
  });

  return {
    available,
    percent,
    error,
  };
}
