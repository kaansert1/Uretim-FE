import PageLoader from "@/components/common/PageLoader";
import UpdaterAlertSnack from "@/components/common/UpdaterAlertSnack";
import { useLoader } from "@/store/features/loader";
import { CssBaseline } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function AppLayout() {
  const { isLoading } = useLoader();

  return (
    <>
      <Outlet />
      <PageLoader isLoading={isLoading} />
      <ToastContainer
        position="top-right"
        draggable
        style={{
          minWidth: "350px",
          maxWidth: "500px",
        }}
        autoClose={1000 * 8}
        closeButton={<></>}
        pauseOnHover
        newestOnTop
        hideProgressBar
        bodyStyle={{
          padding: 0,
        }}
        toastStyle={{
          padding: 0,
        }}
      />
      <UpdaterAlertSnack />
      <CssBaseline />
    </>
  );
}
