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
} from "@mui/material";
import CustomDialog from "../common/CustomDialog";
import AuthRepository from "../../repositories/AuthRepository";
import { IEmployee } from "@/utils/interfaces/Employee";
import { useEffect, useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaSignInAlt,
  FaUserCircle,
} from "react-icons/fa";
import { changeEmployee, useEmployee } from "@/store/features/employee";
import ToastHelper from "@/utils/helpers/ToastHelper";
import store from "@/store";
import PauseRepository from "@/repositories/PauseRepository";

interface SelectEmployeeModalProps extends Omit<ModalProps, "children"> {
  onPersonelChanged: () => void;
}

export default function SelectEmployeeModal({
  open,
  onClose,
  onPersonelChanged,
}: SelectEmployeeModalProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(
    null
  );
  const [employeeList, setEmployeeList] = useState<IEmployee[]>([]);

  const { employee, workOrder } = useEmployee();

  const handleSubmit = () => {
    if (!selectedEmployee) {
      ToastHelper.error("Lütfen personel seçiniz");
      return;
    }

    if (password.length === 0) {
      ToastHelper.error("Lütfen şifre giriniz");
      return;
    }

    AuthRepository.passwordVerify(Number(selectedEmployee.staffCode), password)
      .then(() => {
        PauseRepository.changePausePersonel({
          isemrino: workOrder?.isemrino ?? "",
          vekilId: Number(selectedEmployee.staffCode),
        }).then(() => {
          store.dispatch(changeEmployee(selectedEmployee));
          ToastHelper.success("Personel başarıyla değiştirildi");

          onClose?.({}, "backdropClick");
          onPersonelChanged();
        });
      })
      .catch(() => {
        ToastHelper.error("Şifre yanlış, lütfen tekrar deneyiniz");
      });
  };

  const getEmployeeList = () => {
    AuthRepository.getEmployeeAndMachines().then((res) => {
      const { staffs } = res.data.data;
      setEmployeeList(staffs);
    });
  };

  useEffect(() => {
    getEmployeeList();
  }, []);

  return (
    <CustomDialog
      title="Personel Seç"
      fullWidth
      maxWidth="md"
      open={open}
      onClose={onClose}
    >
      <DialogContent>
        <Card elevation={0}>
          <CardContent>
            <Stack direction="column" spacing={3}>
              <Autocomplete
                value={selectedEmployee}
                onChange={(_, value) => setSelectedEmployee(value)}
                options={employeeList}
                isOptionEqualToValue={(option, value) =>
                  option.staffCode === value?.staffCode
                }
                getOptionDisabled={(option) =>
                  employee?.staffCode === option.staffCode
                }
                getOptionLabel={(option) =>
                  `${option.staffCode} - ${option.firstName} ${option.lastName}`
                }
                ListboxProps={{
                  sx: {
                    "& .MuiAutocomplete-option": {
                      padding: 2,
                    },
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Personel"
                    placeholder="Personel Seçiniz"
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
              />
            </Stack>
          </CardContent>

          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<FaSignInAlt />}
              onClick={handleSubmit}
            >
              Giriş Yap
            </Button>
          </CardActions>
        </Card>
      </DialogContent>
    </CustomDialog>
  );
}
