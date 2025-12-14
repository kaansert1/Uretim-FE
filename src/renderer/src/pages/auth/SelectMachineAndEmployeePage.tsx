import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  CardActions,
  Button,
  Autocomplete,
  TextField,
  Stack,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import { MdOutlineLogin } from "react-icons/md";
import {
  FaUserCircle,
  FaIndustry,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { IMachine } from "@/utils/interfaces/Machine";
import { IEmployee } from "@/utils/interfaces/Employee";
import AuthRepository from "@/repositories/AuthRepository";
import WorkOrderRepository from "@/repositories/WorkOrderRepository";
import EmployeeHelper from "@/utils/helpers/EmployeeHelper";
import WorkOrderSelectModal from "@/components/modals/workorder/WorkOrderSelectModal";
import ToastHelper from "@/utils/helpers/ToastHelper";
import { IWorkOrder } from "@/utils/interfaces/WorkOrder";
import { MESSAGES } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import PeksanLogo from "@/assets/images/peksan.png";

interface ISelected {
  machine: IMachine | null;
  employee: IEmployee | null;
}

const SelectMachineAndEmployeePage: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [machines, setMachines] = useState<IMachine[]>([]);
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [dialog, setDialog] = useState<boolean>(false);
  const [workOrders, setWorkOrders] = useState<IWorkOrder[]>([]);
  const [selected, setSelected] = useState<ISelected>({
    machine: null,
    employee: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMachinesAndEmployees = async () => {
      const { data } = (await AuthRepository.getEmployeeAndMachines()).data;
      setMachines(data.machines);
      setEmployees(data.staffs);
    };

    fetchMachinesAndEmployees();
  }, []);

  const loginAndNextPage = (workOrder: IWorkOrder) => {
    EmployeeHelper.login({
      employee: selected.employee!,
      machine: selected.machine!,
      workOrder,
    });
    navigate("/auth/questions");
  };

  const handleClick = async () => {
    if (!selected.employee) {
      ToastHelper.error("Lütfen personel seçiniz");
      return;
    }

    if (!selected.machine) {
      ToastHelper.error("Lütfen makine seçiniz");
      return;
    }

    if (password.length === 0) {
      ToastHelper.error("Lütfen şifre giriniz");
      return;
    }

    const isPasswordVerified = await verifyPassword();

    if (!isPasswordVerified) {
      ToastHelper.error("Şifre yanlış, lütfen tekrar deneyiniz.");
      return;
    }

    const { data: results } = (
      await WorkOrderRepository.getByMachineId(selected.machine!.machineCode)
    ).data;

    if (results.length === 1) {
      loginAndNextPage(results[0]);
    } else if (results.length > 1) {
      setWorkOrders(results);
      setDialog(true);
    } else {
      ToastHelper.error(MESSAGES["workorder-notfound"]);
    }
  };

  const verifyPassword = async () => {
    try {
      const response = await AuthRepository.passwordVerify(
        Number(selected.employee!.staffCode),
        password
      );

      return response.data.success ?? false;
    } catch {
      return false;
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: (theme) =>
          `linear-gradient(135deg, rgba(${theme.palette.primary.main}, 0.1) 0%, rgba(${theme.palette.primary.dark}, 0.1) 100%)`,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(255, 255, 255, 0.7)",
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "white",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={3}
            mb={4}
          >
            <img src={PeksanLogo} alt="Peksan Logo" width={180} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: (theme) => theme.palette.primary.main,
              }}
            >
              Personel ve Makine Seçimi
            </Typography>
          </Box>

          <Stack direction="column" spacing={3}>
            <Autocomplete
              value={selected.employee}
              onChange={(_, value) =>
                setSelected({ ...selected, employee: value })
              }
              options={employees}
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
                        <FaUserCircle size={20} color="#666" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: (theme) => theme.palette.primary.main,
                        },
                      },
                    },
                  }}
                />
              )}
            />

            <Autocomplete
              value={selected.machine}
              onChange={(_, value) =>
                setSelected({ ...selected, machine: value })
              }
              options={machines}
              getOptionLabel={(option) =>
                `${option.machineCode} - ${option.description1}`
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
                  label="Makine"
                  placeholder="Makine Seçiniz"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaIndustry size={20} color="#666" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: (theme) => theme.palette.primary.main,
                        },
                      },
                    },
                  }}
                />
              )}
            />

            <TextField
              label="Şifre"
              placeholder="Şifre Giriniz"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaLock size={20} color="#666" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <FaEye size={20} color="#666" />
                      ) : (
                        <FaEyeSlash size={20} color="#666" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                  },
                },
              }}
            />

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleClick}
              startIcon={<MdOutlineLogin />}
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Giriş Yap
            </Button>
          </Stack>
        </Paper>
      </Container>

      <WorkOrderSelectModal
        open={dialog}
        onClose={() => setDialog(false)}
        data={workOrders}
        onSave={(workOrder) => {
          loginAndNextPage(workOrder);
        }}
      />
    </Box>
  );
};

export default SelectMachineAndEmployeePage;
