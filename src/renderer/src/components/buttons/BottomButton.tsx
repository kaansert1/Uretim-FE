import React from "react";
import { ButtonProps, Button, alpha } from "@mui/material";

interface IProps extends ButtonProps {
  children: React.ReactNode;
  icon?: React.ReactElement;
}

const BottomButton = ({ children, icon, sx, ...props }: IProps) => {
  return (
    <Button
      {...props}
      sx={{
        height: "100%",
        flex: 1,
        fontWeight: 600,
        fontSize: "1rem",
        borderRadius: 2,
        textTransform: "none",
        transition: "all 0.2s ease-in-out",
        boxShadow: "none",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: (theme) => alpha(theme.palette.common.white, 0.1),
          transform: "translateY(100%)",
          transition: "transform 0.2s ease-in-out",
        },
        "&:hover": {
          boxShadow: "none",
          transform: "translateY(-2px)",
          "&::before": {
            transform: "translateY(0)",
          },
        },
        "&:active": {
          transform: "translateY(0)",
        },
        ...sx,
      }}
      variant="contained"
      size="large"
      startIcon={
        icon &&
        React.cloneElement(icon, {
          style: { fontSize: "1.5rem" },
        })
      }
    >
      {children}
    </Button>
  );
};

export default BottomButton;
