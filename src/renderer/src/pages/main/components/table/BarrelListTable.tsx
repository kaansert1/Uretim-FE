import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Chip,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { IBarrel } from "@/utils/interfaces/Barrel";

interface IBarrelListTableProps {
  barrelList: IBarrel[];
  onRefresh: () => void;
}

export const BarrelListTable = ({
  barrelList,
  onRefresh,
}: IBarrelListTableProps) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: 300,
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        "& .MuiTable-root": {
          minWidth: 650,
        },
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
                color: "white",
                fontWeight: 600,
                fontSize: "0.9rem",
                borderTopLeftRadius: "16px",
              }}
            >
              Dat Numarası
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
                color: "white",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              Miktar
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
                color: "white",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              Harcanan Miktar
            </TableCell>
            <TableCell
              sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
                color: "white",
                fontWeight: 600,
                fontSize: "0.9rem",
                borderTopRightRadius: "16px",
                position: "relative",
              }}
            >
              Onay Durumu
              <IconButton
                onClick={onRefresh}
                size="small"
                sx={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {barrelList.map((barrel, index) => (
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
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                {barrel.datNo}
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                {barrel.miktar}
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                {barrel.harcanan}
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={barrel.onaylandi ? "success" : "error"}
                  label={
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: "inherit",
                      }}
                    >
                      {barrel.onaylandi ? "Onaylandı" : "Onaylanmadı"}
                    </Typography>
                  }
                  sx={{
                    borderRadius: 1,
                    minWidth: 100,
                    height: 24,
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
