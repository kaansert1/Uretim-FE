import { toast } from "react-toastify";
import ToastAlert from "@/components/common/ToastAlert";

class ToastHelper {
  static success(message: string) {
    return toast(<ToastAlert type="success" message={message} />);
  }

  static error(message: string) {
    return toast(<ToastAlert type="error" message={message} />);
  }

  static info(message: string) {
    return toast(<ToastAlert type="info" message={message} />);
  }
}

export default ToastHelper;
