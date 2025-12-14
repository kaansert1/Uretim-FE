import {
  setScale,
  setScaleCount,
  useProduction,
  clearScale,
} from "@/store/features/production";
import { ProductionType } from "@/utils/interfaces/enums/ProductionType";
import { IPortInfo } from "@/utils/interfaces/SerialPort";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { IoMdRefresh } from "react-icons/io";
import ToastHelper from "@/utils/helpers/ToastHelper";

const ProductInputGroups = () => {
  const [ports, setPorts] = useState<IPortInfo[]>([]);
  const [port, setPort] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const { minMax, terazi, productionType } = useProduction();

  const getSerialPorts = async () => {
    const serialPorts = await window.api.getSerialPorts();
    /* const port = await window.api.getCurrentPort(); */

    setPorts(serialPorts);

    //HT: portlar taranıp listeye geldiğinde ilk portu seçili olarak çalıştır.

    if (serialPorts.length > 0) {
      window.electron.ipcRenderer.send("connect-com-port", serialPorts[0].path);
      setPort(serialPorts[0].path);
    }
  };

  const handleChange = (e: SelectChangeEvent<string>) => {
    setPort(e.target.value);

    window.electron.ipcRenderer.send("connect-com-port", e.target.value);
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      // Program kapatıp açtığında olduğu gibi login sayfasına yönlendir
      // Tüm store'ları sıfırlamak yerine sadece COM portları yenile
      await getSerialPorts();

      // Login sayfasına yönlendir (program açıldığında olduğu gibi)
      window.location.hash = '/auth/login';
      window.location.reload();

    } catch (error) {
      console.error("Refresh error:", error);
      ToastHelper.error("Sistem yenilenirken bir hata oluştu");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    getSerialPorts();

    window.electron.ipcRenderer.on(
      "scale-data",
      (_, data: { net: number; dara: number }) => {
        console.log("Terazi verisi", data);
        store.dispatch(setScale(data));
      }
    );

    return () => {
      window.electron.ipcRenderer.removeAllListeners("scale-data");
    };
  }, []);

  return (
    <Box sx={{ width: 250, display: "flex", flexDirection: "column", gap: 5 }}>
      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
        <FormControl sx={{ flex: 1 }}>
          <InputLabel id="select-com-port-label">COM Port</InputLabel>
          <Select
            value={port}
            onChange={handleChange}
            labelId="select-com-port-label"
            label="COM"
            //placeholder="Lütfen com port seçiniz."
          >
            {ports.map((port, index) => (
              <MenuItem sx={{ height: 50 }} key={index} value={port.path}>
                {port.path}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Tooltip title="Sistemi Yenile">
          <IconButton
            onClick={handleRefresh}
            disabled={isRefreshing}
            sx={{
              bgcolor: (theme) => theme.palette.primary.main,
              color: "white",
              "&:hover": {
                bgcolor: (theme) => theme.palette.primary.dark,
              },
              "&:disabled": {
                bgcolor: (theme) => theme.palette.grey[400],
                color: "white",
              },
              height: 56, // Select ile aynı yükseklik
              width: 56,
              transition: "all 0.2s ease-in-out",
            }}
          >
            <IoMdRefresh
              size={24}
              style={{
                animation: isRefreshing ? "spin 1s linear infinite" : "none",
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <TextField
        sx={{ flex: 1 }}
        label="Gramaj"
        fullWidth
        value={minMax.birimAgirlik}
        placeholder="Birim ağırlık"
        InputProps={{
          readOnly: true,
          style: {
            fontWeight: 600,
          },
        }}
      />
      <TextField
        sx={{ flex: 1 }}
        label="Brüt KG"
        fullWidth
        value={terazi.brut.toFixed(5)}
        placeholder="Brüt KG"
        InputProps={{
          readOnly: true,
          style: {
            textAlign: "right",
            fontWeight: 600,
          },
        }}
      />
      <TextField
        sx={{ flex: 1 }}
        label="Dara"
        fullWidth
        value={terazi.dara}
        placeholder="Dara"
        InputProps={{
          readOnly: true,
          style: {
            fontWeight: 600,
          },
        }}
      />
      <TextField
        sx={{ flex: 1 }}
        label="KG"
        fullWidth
        value={terazi.net.toFixed(5)}
        placeholder="KG"
        InputProps={{
          readOnly: true,
          style: {
            fontWeight: 600,
          },
        }}
      />
      <TextField
        label="Adet"
        fullWidth
        value={terazi.adet}
        onChange={(e) => store.dispatch(setScaleCount(e.target.value))}
        placeholder="Adet"
        InputProps={{
          readOnly: productionType !== ProductionType.Numune,
          style: {
            fontWeight: 600,
          },
        }}
      />
    </Box>
  );
};

export default ProductInputGroups;
