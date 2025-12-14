import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

interface ConfirmAlertModalProps extends Omit<DialogProps, "children"> {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmAlertModal({
  open,
  onClose,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Evet",
  cancelText = "Hayır",
  ...props
}: ConfirmAlertModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
      }}
      {...props}
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
        {title}
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
          {description}
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
          onClick={onCancel}
          variant="outlined"
          color="error"
          startIcon={<CancelOutlinedIcon />}
          sx={{
            minWidth: 120,
            py: 1,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
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
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
