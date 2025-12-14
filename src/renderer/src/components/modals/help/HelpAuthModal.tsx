import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  DialogContent,
  IconButton,
  InputAdornment,
  ModalProps,
  Stack,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import CustomDialog from "../../common/CustomDialog";
import AuthRepository from "../../../repositories/AuthRepository";
import { IEmployee } from "@/utils/interfaces/Employee";
import { useEffect, useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaSignInAlt,
  FaUserCircle,
} from "react-icons/fa";
import ToastHelper from "@/utils/helpers/ToastHelper";
import PeksanLogo from "@/assets/images/peksan.png";

interface IProps extends Omit<ModalProps, "children"> {
  onSuccess: (employee: IEmployee) => void;
}

const HelpAuthModal = ({ open, onClose, onSuccess }: IProps) => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(null);
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      fetchEmployees();
      // Reset form
      setSelectedEmployee(null);
      setPassword("");
      setShowPassword(false);
    }
  }, [open]);

  const fetchEmployees = async () => {
    try {
      const { data } = (await AuthRepository.getEmployeeAndMachines()).data;
      setEmployees(data.staffs);
    } catch (error) {
      ToastHelper.error("Personel listesi alınamadı!");
    }
  };

  const handleSubmit = async () => {
    if (!selectedEmployee) {
      ToastHelper.error("Lütfen personel seçiniz");
      return;
    }

    if (!password) {
      ToastHelper.error("Lütfen şifre giriniz");
      return;
    }

    setLoading(true);
    try {
      await AuthRepository.passwordVerify(Number(selectedEmployee.staffCode), password);
      onSuccess(selectedEmployee);
      onClose?.({}, "backdropClick");
      ToastHelper.success("Giriş başarılı!");
    } catch (error) {
      ToastHelper.error("Şifre yanlış, lütfen tekrar deneyiniz.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <CustomDialog
      title=""
      fullWidth
      onClose={onClose}
      open={open}
      maxWidth="sm"
    >
      <DialogContent>
        <Card elevation={0}>
          <CardContent>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
              mb={3}
            >
              <img src={PeksanLogo} alt="Peksan Logo" width={120} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: (theme) => theme.palette.primary.main,
                  textAlign: "center",
                }}
              >
                Yardım İsteği Yanıtlama
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: (theme) => theme.palette.text.secondary,
                  textAlign: "center",
                }}
              >
                Lütfen kimlik doğrulaması yapınız
              </Typography>
            </Box>

            <Stack spacing={3}>
              <Autocomplete
                options={employees}
                getOptionLabel={(option) => `${option.staffCode} - ${option.firstName || ''} ${option.lastName || ''}`.trim()}
                value={selectedEmployee}
                onChange={(_, newValue) => setSelectedEmployee(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Personel"
                    placeholder="Personel Seçiniz"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaUserCircle size={24} />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <TextField
                label="Şifre"
                placeholder="Şifre Giriniz"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock size={24} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEye size={24} />
                        ) : (
                          <FaEyeSlash size={24} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </Stack>
          </CardContent>

          <CardActions sx={{ justifyContent: "flex-end", px: 3, pb: 3 }}>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={() => onClose?.({}, "backdropClick")}
              sx={{ mr: 1 }}
            >
              İptal
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<FaSignInAlt />}
              onClick={handleSubmit}
              disabled={loading || !selectedEmployee || !password}
            >
              {loading ? "Doğrulanıyor..." : "Giriş Yap"}
            </Button>
          </CardActions>
        </Card>
      </DialogContent>
    </CustomDialog>
  );
};

export default HelpAuthModal;
