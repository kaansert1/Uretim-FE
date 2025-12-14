import useUpdate from "@/hooks/useUpdate";
import {
  Alert,
  AlertTitle,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
} from "@mui/material";

export default function UpdateAvailableModal() {
  const { available, error, percent } = useUpdate();

  return (
    <Dialog open={available || error != null} maxWidth="md" fullWidth>
      <DialogTitle>
        <Alert severity={error ? "error" : "info"} variant="outlined">
          <AlertTitle>{error ? "Hata" : "Bilgilendirme"}</AlertTitle>
          {!error && (
            <>
              Güncelleme mevcut, lütfen <strong>bekleyiniz...</strong>
            </>
          )}
        </Alert>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ my: 4 }}>
          {(error && error) || (
            <LinearProgress
              variant={percent === 0 ? "query" : "determinate"}
              color="secondary"
              value={percent}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
