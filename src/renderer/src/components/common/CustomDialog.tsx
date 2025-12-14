import React from "react";
import {
  Dialog,
  DialogTitle,
  Box,
  Typography,
  DialogProps,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Close } from "@mui/icons-material";

interface IProps extends DialogProps {
  title: string;
  closable?: boolean;
  children: React.ReactNode;
}

const CustomDialog = ({
  title,
  children,
  onClose,
  open,
  closable = true,
  ...props
}: IProps) => {
  return (
    <Dialog {...props} open={open} onClose={onClose}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, userSelect: "none" }}>
            {title}
          </Typography>
          {closable && (
            <IconButton
              onClick={() => onClose && onClose({}, "escapeKeyDown")}
              color="inherit"
            >
              <Close />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      {children}
    </Dialog>
  );
};

export default CustomDialog;
