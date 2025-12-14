import { createHashRouter } from "react-router-dom";
import MainPage from "./pages/main/MainPage";
import SelectMachineAndEmployeePage from "./pages/auth/SelectMachineAndEmployeePage";
import QuestionsPage from "./pages/questions/QuestionsPage";
import PrintPage from "./pages/print/PrintPage";
import AuthLayout from "./pages/layouts/AuthLayout";
import DashboardLayout from "./pages/main/layout/DashboardLayout";
import AppLayout from "./pages/layouts/AppLayout";
// import AutoFixDemo from "./pages/AutoFixDemo"; // Demo - Production'da kullanılmıyor

const routes = createHashRouter([
  {
    path: "/print",
    element: <PrintPage />,
  },
  // Demo route - Production'da kullanılmıyor
  // {
  //   path: "/autofix-demo",
  //   element: <AutoFixDemo />,
  // },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <MainPage />,
          },
        ],
      },
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <SelectMachineAndEmployeePage />,
          },
          {
            path: "questions",
            element: <QuestionsPage />,
          },
        ],
      },
    ],
  },
]);

export default routes;
