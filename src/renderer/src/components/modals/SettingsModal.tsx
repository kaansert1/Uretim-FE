import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import ToastHelper from "@/utils/helpers/ToastHelper";

interface IProps {
  open: boolean;
  onClose: () => void;
}

const SettingsModal = ({ open, onClose }: IProps) => {
  const [printers, setPrinters] = useState<string[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null);

  const handleSave = async () => {
    if (selectedPrinter) {
      try {
        await window.api.setDefaultPrinter(selectedPrinter);
        ToastHelper.success("Varsayılan yazıcı başarıyla kaydedildi");
        onClose();
      } catch (error) {
        ToastHelper.error("Yazıcı kaydedilirken bir hata oluştu");
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [printerList, defaultPrinter] = await Promise.all([
          window.api.getPrinters(),
          window.api.getDefaultPrinter(),
        ]);
        setPrinters(printerList);

        // Eğer varsayılan yazıcı printer listesinde varsa onu seç
        if (defaultPrinter && printerList.includes(defaultPrinter)) {
          setSelectedPrinter(defaultPrinter);
        } else {
          ToastHelper.error("Varsayılan yazıcı sistemde bulunamadı!");
          setSelectedPrinter(null);
        }
      } catch (error) {
        ToastHelper.error("Yazıcı listesi alınırken bir hata oluştu");
      }
    };

    loadData();
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Ayarlar</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={printers}
          value={selectedPrinter}
          onChange={(_, newValue) => setSelectedPrinter(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Varsayılan Yazıcı"
              margin="normal"
              fullWidth
            />
          )}
          renderOption={(props, option) => {
            const { key, ...otherProps } = props;
            return (
              <li key={key} {...otherProps} style={{ padding: "12px 16px" }}>
                {option}
              </li>
            );
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" size="large">
          İptal
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!selectedPrinter}
          size="large"
        >
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsModal;
