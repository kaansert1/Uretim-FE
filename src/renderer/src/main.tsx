import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "@/store";
import "react-toastify/dist/ReactToastify.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <RouterProvider router={routes} />
  </Provider>
);
