import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

export default function CloseProgramButton() {
  const [dialog, setDialog] = useState<boolean>(false);

  const handleClose: DialogProps["onClose"] = (_, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;

    setDialog(false);
  };

  const handleCloseProgram = () => {
    window.electron.ipcRenderer.send("close");
  };

  return (
    <React.Fragment>
      <IconButton
        color="inherit"
        onClick={() => setDialog(true)}
        sx={{
          backgroundColor: (theme) => theme.palette.error.dark,
          "&:hover": {
            backgroundColor: (theme) => theme.palette.error.light,
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <Dialog open={dialog} onClose={handleClose} maxWidth="md" fullWidth>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">PROGRAMI KAPAT</Typography>

            <IconButton
              size="large"
              color="inherit"
              onClick={() => setDialog(false)}
              sx={{ marginLeft: "auto" }}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <DialogContent>
          <DialogContentText variant="h6">
            Program kapatılacak, emin misiniz?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            size="large"
            variant="contained"
            onClick={() => setDialog(false)}
          >
            Hayır
          </Button>
          <Button size="large" variant="contained" onClick={handleCloseProgram}>
            Evet
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
