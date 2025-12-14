import { useNumuneContext } from "@/contexts/NumuneContext";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Dialog,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export const NumuneWarningModal = () => {
  const { infoModal, setInfoModal } = useNumuneContext();

  return (
    <Dialog
      open={infoModal}
      onClose={() => setInfoModal(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          textAlign: "center",
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "primary.main",
        }}
      >
        Numune Alım Uyarısı
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            textAlign: "center",
            fontSize: "1.1rem",
            color: "text.secondary",
            mb: 2,
            lineHeight: 1.5,
          }}
        >
          Numune saatleri arasında olduğunuz için numune alımı yapınız.
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Button
          onClick={() => setInfoModal(false)}
          variant="outlined"
          color="primary"
          startIcon={<CheckCircleOutlineIcon />}
          sx={{
            minWidth: 120,
            py: 1,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          Tamam
        </Button>
      </DialogActions>
    </Dialog>
  );
};
