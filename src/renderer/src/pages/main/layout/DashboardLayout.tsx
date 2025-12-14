import MinMaxControlModal from "@/components/modals/minmax/MinMaxControlModal";
import { NumuneProvider } from "@/contexts/NumuneContext";
import { PauseProvider } from "@/contexts/PauseContext";
import BottomButtonGroups from "@/pages/main/components/groups/BottomButtonGroups";
import RightButtonGroups from "@/pages/main/components/groups/RightButtonGroups";
import Header from "@/pages/main/components/header/Header";
import WorkOrderInfoList from "@/pages/main/components/workorder/WorkOrderInfoList";
import LogRepository from "@/repositories/LogRepository";
import { useEmployee } from "@/store/features/employee";
import ToastHelper from "@/utils/helpers/ToastHelper";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const { isLoggedIn, machine, employee } = useEmployee();

  if (!isLoggedIn) return <Navigate to="/auth/login" />;

  useEffect(() => {
    window.electron.ipcRenderer.on("print-label", (_, res: ISlipStatus) => {
      if (!res.ok) {
        ToastHelper.error(
          res.error ? `Yazıcı hatası:  ${res.error}` : "Yazıcı hatası!"
        );
        return;
      }

      LogRepository.printLog({
        machineId: machine?.machineCode ?? "",
        serialNo: res.seriNo ?? "",
        staffId: employee?.staffCode ?? "",
      });

      ToastHelper.success("Etiket basıldı: " + res.seriNo);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners("print-label");
    };
  }, []);

  return (
    <NumuneProvider>
      <PauseProvider>
        <Box
          sx={{
            height: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Header />
          <Box sx={{ flexGrow: 1, overflow: "hidden", display: "flex" }}>
            <WorkOrderInfoList />
            <Box sx={{ flex: 1, display: "flex", flexDirection: "row" }}>
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                  }}
                >
                  <Outlet />
                </Box>
                <Box sx={{ width: "100%" }}>
                  <BottomButtonGroups />
                </Box>
              </Box>
              <Box>
                <RightButtonGroups />
              </Box>
            </Box>
          </Box>
          <MinMaxControlModal />
        </Box>
      </PauseProvider>
    </NumuneProvider>
  );
};

export default DashboardLayout;
