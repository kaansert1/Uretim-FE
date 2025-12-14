import { useAssembly } from "@/store/features/assembly";
import { SerialType } from "@/utils/enums/SerialType";
import { IMaterialBody } from "@/utils/interfaces/Material";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  Tooltip,
} from "@mui/material";
import { useMemo } from "react";

type Props = {
  data: IMaterialBody | null;
  type: SerialType;
};

const AssemblyTable = ({ data, type }: Props) => {
  const { materials } = useAssembly();

  const totalAmount = useMemo(() => {
    return data?.data.reduce((prev, curr) => prev + curr.remaining, 0) ?? 0;
  }, [materials]);

  return (
    <Box
      component={Paper}
      sx={{
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          p: 1.5,
          backgroundColor: (theme) => theme.palette.primary.main,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: "white",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {data?.description ?? ""}
          <Chip
            label={type}
            size="small"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              fontWeight: 600,
              height: 20,
              "& .MuiChip-label": {
                px: 1,
                fontSize: "0.75rem",
              },
            }}
          />
        </Typography>
      </Box>

      <TableContainer sx={{ flex: 1 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.main,
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  py: 1,
                }}
              >
                Seri Numarası
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.main,
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  py: 1,
                }}
              >
                Miktar
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.main,
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  py: 1,
                }}
              >
                Kalan
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((item, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: (theme) => theme.palette.action.hover,
                  },
                  "&:last-child td": {
                    borderBottom: 0,
                  },
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.action.selected,
                  },
                }}
              >
                <TableCell
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    py: 1,
                  }}
                >
                  {item.serialNo}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    py: 1,
                    color: (theme) => theme.palette.primary.main,
                  }}
                >
                  {item.quantity}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    py: 1,
                    color: (theme) => {
                      if (item.remaining === 0) {
                        return theme.palette.error.main;
                      } else if (item.remaining < item.quantity * 0.2) {
                        return theme.palette.warning.main;
                      } else {
                        return theme.palette.success.main;
                      }
                    },
                  }}
                >
                  <Tooltip
                    title={
                      item.remaining === 0
                        ? "Tükenmiş"
                        : item.remaining < item.quantity * 0.2
                        ? "Az Kaldı"
                        : "Yeterli"
                    }
                  >
                    <Box>{item.remaining}</Box>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          p: 1,
          backgroundColor: (theme) => theme.palette.primary.light,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 0.25,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              fontWeight: 500,
              fontSize: "0.7rem",
            }}
          >
            Toplam Kalan
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: 1,
            }}
          >
            {totalAmount}
            <Typography
              component="span"
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                fontWeight: 500,
                ml: 0.5,
                fontSize: "0.7rem",
              }}
            >
              Adet
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AssemblyTable;
