import ProductionRepository from "@/repositories/ProductionRepository";
import { useEmployee } from "@/store/features/employee";
import { IRemainingMaterial } from "@/utils/interfaces/Material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  CircularProgressProps,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { grey } from "@mui/material/colors";

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress size={48} variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="body2"
          fontWeight={600}
          component="div"
          sx={{ color: "text.secondary" }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function RemainingMaterial() {
  const [material, setMaterial] = useState<IRemainingMaterial>({
    remaining: 0,
    spent: 0,
    total: 0,
  });
  const { workOrder } = useEmployee();

  const loadRemainingMaterials = () => {
    ProductionRepository.getRemainingMaterial(workOrder?.isemrino ?? "").then(
      ({ data: result }) => {
        setMaterial(result);
      }
    );
  };

  const percentValue = useMemo(
    () => (material.remaining / material.total) * 100,
    [material]
  );

  useEffect(() => {
    loadRemainingMaterials();
  }, []);

  return (
    <Box sx={{ flex: 1 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" fontWeight="600" color={grey.A700}>
            Hammadde Bilgileri
          </Typography>

          <List
            sx={{
              ".MuiListItemText-primary": {
                fontSize: 18,
              },
              ".MuiChip-label": {
                fontSize: 16,
                fontWeight: 600,
              },
            }}
          >
            <ListItemButton>
              <ListItemText>Toplam Miktar:</ListItemText>
              <Chip color="success" label={material.total.toFixed(2) + " kg"} />
            </ListItemButton>

            <ListItemButton>
              <ListItemText>Harcanan Miktar:</ListItemText>
              <Chip color="info" label={material.spent.toFixed(2) + " kg"} />
            </ListItemButton>

            <ListItemButton>
              <ListItemText>Kalan Miktar:</ListItemText>
              <Chip
                color="error"
                label={material.remaining.toFixed(2) + " kg"}
              />
            </ListItemButton>

            <ListItemButton>
              <ListItemText>Kalan Miktar(%):</ListItemText>
              <CircularProgressWithLabel value={percentValue} />
            </ListItemButton>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
