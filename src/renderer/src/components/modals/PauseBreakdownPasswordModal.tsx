import {
  DialogContent,
  DialogProps,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import CustomDialog from "../common/CustomDialog";
import { useEmployee } from "@/store/features/employee";
import { useMemo, useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import AuthRepository from "@/repositories/AuthRepository";
import ToastHelper from "@/utils/helpers/ToastHelper";
interface PauseBreakdownPasswordModalProps
  extends Omit<DialogProps, "children"> {
  onSuccess: () => void;
  type: "mola" | "breakdown";
}

const PauseBreakdownPasswordModal = ({
  open,
  onClose,
  onSuccess,
  type = "mola",
}: PauseBreakdownPasswordModalProps) => {
  const { employee, previousEmployee } = useEmployee();
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const getEmployee = useMemo(() => {
    return previousEmployee || employee;
  }, [employee, previousEmployee]);

  const handleSubmit = () => {
    const employee = getEmployee;

    if (!employee) {
      return;
    }

    AuthRepository.passwordVerify(Number(employee.staffCode), password)
      .then(() => {
        onClose?.({}, "backdropClick");
        onSuccess();
      })
      .catch(() => {
        ToastHelper.error("Şifre yanlış, lütfen tekrar deneyiniz.");
      });
  };

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title={
        type === "mola"
          ? "Mola Bitirme - (Personel Şifre Girişi)"
          : "Duruş Bitirme - (Personel Şifre Girişi)"
      }
      fullWidth
      maxWidth="md"
    >
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            p: 2,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: (theme) => theme.palette.primary.dark,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: (theme) => theme.palette.common.white,
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {getEmployee?.firstName} {getEmployee?.lastName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: (theme) => theme.palette.common.white,
                textAlign: "center",
                mt: 1,
                opacity: 0.8,
              }}
            >
              Personel için şifre girişi yapınız
            </Typography>
          </Paper>

          <TextField
            fullWidth
            label="Şifre"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaLock size={24} color="#666" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? (
                      <FaEye size={24} color="#666" />
                    ) : (
                      <FaEyeSlash size={24} color="#666" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                height: 56,
                fontSize: "1.1rem",
                "&:hover": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: (theme) => theme.palette.primary.main,
                  },
                },
              },
              "& .MuiInputLabel-root": {
                fontSize: "1.1rem",
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="outlined"
          onClick={() => onClose?.({}, "backdropClick")}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
          }}
        >
          İptal
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
          }}
        >
          Onayla
        </Button>
      </DialogActions>
    </CustomDialog>
  );
};

export default PauseBreakdownPasswordModal;
