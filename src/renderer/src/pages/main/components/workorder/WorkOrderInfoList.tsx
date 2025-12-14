import WorkOrderRepository from "@/repositories/WorkOrderRepository";
import { useEmployee } from "@/store/features/employee";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Skeleton,
  alpha,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const WorkOrderInfoList = () => {
  const [data, setData] = useState<Record<string, string> | null>(null);
  const { workOrder, machine } = useEmployee();

  const getWorkOrderInfo = async () => {
    const { data: results } = (
      await WorkOrderRepository.getWorkOrderInfo({
        machineId: parseInt(machine!.machineCode),
        workOrder: workOrder!.isemrino,
      })
    ).data;

    setData(results.workOrderInfo);
  };

  useEffect(() => {
    getWorkOrderInfo();
  }, [workOrder!.isemrino]);

  return (
    <Box
      sx={{
        width: 350,
        height: "100%",
        overflow: "auto",
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
        borderRight: "1px solid",
        borderColor: (theme) => alpha(theme.palette.divider, 0.15),
        position: "relative",
      }}
    >
      {data !== null ? (
        <Stack spacing={0}>
          {Object.entries(data).map(([key, value], index) => (
            <CopyToClipboard text={value} key={index}>
              <Box
                sx={{
                  p: 1.5,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  borderBottom: 1,
                  borderColor: (theme) => theme.palette.divider,
                  bgcolor: "white",
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                  },
                  "&:active": {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <Stack spacing={0.5}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                      fontSize: "0.75rem",
                    }}
                  >
                    {key}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                    }}
                  >
                    {value}
                  </Typography>
                </Stack>
              </Box>
            </CopyToClipboard>
          ))}
        </Stack>
      ) : (
        <Stack spacing={0}>
          {Array(18)
            .fill("")
            .map((_, index) => (
              <Box
                key={index}
                sx={{
                  p: 1.5,
                  borderBottom: 1,
                  borderColor: (theme) => theme.palette.divider,
                  bgcolor: "white",
                }}
              >
                <Skeleton
                  variant="text"
                  width={100}
                  sx={{ mb: 1, opacity: 0.3 }}
                />
                <Skeleton variant="text" width="60%" />
              </Box>
            ))}
        </Stack>
      )}
    </Box>
  );
};

export default WorkOrderInfoList;
