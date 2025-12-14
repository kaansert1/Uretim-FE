import { useEmployee } from "@/store/features/employee";
import { TIME_FORMAT } from "@/utils/constants";
import EmployeeHelper from "@/utils/helpers/EmployeeHelper";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  Box,
  keyframes,
  Chip,
  Stack,
  alpha,
} from "@mui/material";
import moment from "moment";
import { useMemo, useState, useEffect, useRef } from "react";
import CloseProgramButton from "@/components/CloseProgramButton";
import { useNavigate } from "react-router-dom";
import { Settings, Person, Factory, AccessTime, Build } from "@mui/icons-material";
import SettingsModal from "@/components/modals/SettingsModal";

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
`;

const Header = () => {
  const [time, setTime] = useState<moment.Moment>(moment());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { machine, employee } = useEmployee();
  const appVersionRef = useRef<string | null>(null);

  const shiftId = useMemo(() => EmployeeHelper.getShift(), []);

  const navigate = useNavigate();

  useEffect(() => {
    window.api
      .getAppVersion()
      .then((version) => (appVersionRef.current = version));

    const interval = setInterval(() => {
      setTime(moment());
      if (EmployeeHelper.getShift() != shiftId) {
        navigate(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.95),
          backdropFilter: "blur(8px)",
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Stack direction="row" spacing={1.5} sx={{ flexGrow: 1 }}>
            <Chip
              icon={<AccessTime />}
              label={`${shiftId}. VARDİYA`}
              color="secondary"
              sx={{
                fontWeight: 600,
                height: "auto",
                "& .MuiChip-label": { py: 1 },
                borderRadius: 2,
              }}
            />
            <Chip
              icon={<Factory />}
              label={`${machine?.machineCode} - ${machine?.description1}`}
              color="info"
              sx={{
                fontWeight: 600,
                height: "auto",
                "& .MuiChip-label": { py: 1 },
                borderRadius: 2,
              }}
            />
            <Chip
              icon={<Person />}
              label={`${employee?.staffCode} - ${employee?.firstName} ${employee?.lastName}`}
              color="success"
              sx={{
                fontWeight: 600,
                height: "auto",
                "& .MuiChip-label": { py: 1 },
                borderRadius: 2,
              }}
            />
          </Stack>

          {/* <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: isConnected ? "success.main" : "error.main",
              px: 2,
              py: 0.5,
              borderRadius: 2,
              animation: `${pulse} 2s ease-in-out infinite`,
              boxShadow: (theme) =>
                `0 0 10px ${
                  isConnected
                    ? theme.palette.success.main
                    : theme.palette.error.main
                }`,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#fff",
                boxShadow: "0 0 5px rgba(255,255,255,0.8)",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "#fff",
                fontWeight: 600,
                userSelect: "none",
              }}
            >
              {isConnected ? "Bağlı" : "Bağlı Değil"}
            </Typography>
          </Box> */}

          <Button
            color="secondary"
            variant="contained"
            endIcon={<Settings />}
            sx={{
              borderRadius: 2,
              px: 2,
              py: 1,
              transition: "all 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: (theme) =>
                  `0 4px 10px ${alpha(theme.palette.common.black, 0.2)}`,
              },
            }}
            onClick={() => setSettingsOpen(true)}
          >
            Ayarlar
          </Button>

          <Typography
            sx={{
              px: 2,
              py: 0.5,
              bgcolor: (theme) => alpha(theme.palette.background.paper, 0.1),
              borderRadius: 2,
              fontWeight: 500,
            }}
          >
            Versiyon - ({appVersionRef.current})
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              px: 2,
              py: 0.5,
              bgcolor: (theme) => alpha(theme.palette.background.paper, 0.1),
              borderRadius: 2,
            }}
          >
            {time.format(TIME_FORMAT)}
          </Typography>

          <CloseProgramButton />
        </Toolbar>
      </AppBar>

      {settingsOpen && (
        <SettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
