import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <Box sx={{ bgcolor: (theme) => theme.palette.grey[100] }}>
      <Outlet />
    </Box>
  );
}
