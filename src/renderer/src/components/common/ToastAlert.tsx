import { Alert, AlertTitle, Typography } from "@mui/material";
import { useCallback } from "react";

type Props = {
  message: string;
  type: "success" | "error";
};

export default function ToastAlert({ message, type }: Props) {
  const getAlertTitle = useCallback(() => {
    switch (type) {
      case "success":
        return "Başarılı";
      case "error":
        return "Hata";
    }
  }, [type]);

  return (
    <Alert severity={type}>
      <AlertTitle fontSize={21}>{getAlertTitle()}</AlertTitle>
      <Typography variant="subtitle1">{message}</Typography>
    </Alert>
  );
}
