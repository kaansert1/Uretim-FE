import {
  Box,
  Paper,
  Stack,
  Typography,
  Grid,
  alpha,
  keyframes,
} from "@mui/material";
import { useEffect } from "react";
import { useEmployee } from "@/store/features/employee";
import {
  useProduction,
  fetchMinMaxValue,
  fetchRemaingValue,
} from "@/store/features/production";
import store from "@/store";

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const RemainingList = () => {
  const { workOrder } = useEmployee();
  const { minMax, produced } = useProduction();

  useEffect(() => {
    store.dispatch(fetchMinMaxValue(workOrder!.isemrino));
    store.dispatch(fetchRemaingValue(parseInt(workOrder!.yedek2)));
  }, [store.dispatch]);

  const isShowAlert = produced.remaining <= 0;

  return (
    <Stack direction="row" spacing={3} sx={{ height: 110 }}>
      <Paper
        elevation={0}
        sx={{
          p: 1,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03),
          borderRadius: 3,
          width: 400,
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Box
              sx={{
                p: 0.75,
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontWeight: 500,
                  display: "block",
                  mb: 0.25,
                  fontSize: "0.7rem",
                }}
              >
                Min Adet
              </Typography>
              <Typography
                variant="body2"
                color="primary"
                sx={{ fontWeight: 600 }}
              >
                {minMax.minad}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                p: 0.75,
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontWeight: 500,
                  display: "block",
                  mb: 0.25,
                  fontSize: "0.7rem",
                }}
              >
                Max Adet
              </Typography>
              <Typography
                variant="body2"
                color="primary"
                sx={{ fontWeight: 600 }}
              >
                {minMax.maxad}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                p: 0.75,
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontWeight: 500,
                  display: "block",
                  mb: 0.25,
                  fontSize: "0.7rem",
                }}
              >
                Min KG
              </Typography>
              <Typography
                variant="body2"
                color="primary"
                sx={{ fontWeight: 600 }}
              >
                {minMax.minkg}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                p: 0.75,
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontWeight: 500,
                  display: "block",
                  mb: 0.25,
                  fontSize: "0.7rem",
                }}
              >
                Max KG
              </Typography>
              <Typography
                variant="body2"
                color="primary"
                sx={{ fontWeight: 600 }}
              >
                {minMax.maxkg}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          bgcolor: "white",
          borderRadius: 3,
          flex: 1,
        }}
      >
        <Grid container spacing={2} sx={{ height: "100%" }}>
          <Grid item xs={4}>
            <Box
              sx={{
                p: 1.5,
                height: "100%",
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                borderRadius: 3,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 500, display: "block", mb: 0.5 }}
              >
                ÜRETİLECEK
              </Typography>
              <Typography
                variant="h5"
                color="info.main"
                sx={{ fontWeight: 600 }}
              >
                {produced.toBeProducedItem.value}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box
              sx={{
                p: 1.5,
                height: "100%",
                bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                borderRadius: 3,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 500, display: "block", mb: 0.5 }}
              >
                ÜRETİLEN
              </Typography>
              <Typography
                variant="h5"
                color="success.main"
                sx={{ fontWeight: 600 }}
              >
                {produced.produced}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box
              sx={{
                p: 1.5,
                height: "100%",
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                borderRadius: 3,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                animation: isShowAlert
                  ? `${pulse} 2s ease-in-out infinite`
                  : "none",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 500, display: "block", mb: 0.5 }}
              >
                KALAN
              </Typography>
              <Typography
                variant="h5"
                color="error.main"
                sx={{ fontWeight: 600 }}
              >
                {produced.remaining}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  );
};

export default RemainingList;
