import {
  Button,
  Card,
  CardContent,
  Checkbox,
  DialogContent,
  FormControlLabel,
  ModalProps,
  Stack,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import CustomDialog from "../../common/CustomDialog";
import RpArızaChecklistRepository from "@/repositories/RpArızaChecklistRepository";
import { IArızaChecklistItem } from "@/utils/interfaces/RpArızaChecklist";
import { useEffect, useState } from "react";
import ToastHelper from "@/utils/helpers/ToastHelper";
import PeksanLogo from "@/assets/images/peksan.png";
import { MdCheckCircle } from "react-icons/md";

interface IProps extends Omit<ModalProps, "children"> {
  onSubmit: (selectedArızalar: string[]) => void;
}

const ArızaChecklistModal = ({ open, onClose, onSubmit }: IProps) => {
  const [arızaList, setArızaList] = useState<IArızaChecklistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isDataFetched, setIsDataFetched] = useState<boolean>(false);

  useEffect(() => {
    if (open && !loading && arızaList.length === 0) {
      fetchArızaList();
    } else if (!open) {
      // Modal kapandığında listeyi temizle
      setArızaList([]);
      setIsDataFetched(false);
    }
  }, [open]);

  const fetchArızaList = async () => {
    setLoading(true);
    try {
      const response = await RpArızaChecklistRepository.getList();
      const arızalar = response.data.map(arıza => ({
        ...arıza,
        selected: false
      }));
      setArızaList(arızalar);
      setIsDataFetched(true); // Veri getirildi olarak işaretle
    } catch (error) {
      console.error("Arıza listesi alınamadı:", error);
      ToastHelper.error("Arıza listesi alınamadı!");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (checkCode: number, checked: boolean) => {
    setArızaList(prev =>
      prev.map(item =>
        item.checkCode === checkCode ? { ...item, selected: checked } : item
      )
    );
  };

  const handleSubmit = async () => {
    const selectedArızalar = arızaList
      .filter(item => item.selected)
      .map(item => item.arıza);

    if (selectedArızalar.length === 0) {
      ToastHelper.warning("Lütfen en az bir arıza seçiniz!");
      return;
    }

    setSubmitting(true);
    try {
      onSubmit(selectedArızalar);
      onClose?.({}, "backdropClick");
      ToastHelper.success("Seçilen arızalar kaydedildi!");
    } catch (error) {
      ToastHelper.error("Arızalar kaydedilirken hata oluştu!");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCount = arızaList.filter(item => item.selected).length;

  return (
    <CustomDialog
      title=""
      fullWidth
      onClose={onClose}
      open={open}
      maxWidth="md"
    >
      <DialogContent>
        <Card elevation={0}>
          <CardContent>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
              mb={3}
            >
              <img src={PeksanLogo} alt="Peksan Logo" width={120} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: (theme) => theme.palette.primary.main,
                  textAlign: "center",
                }}
              >
                Giderilen Arızalar
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: (theme) => theme.palette.text.secondary,
                  textAlign: "center",
                }}
              >
                Giderilen arızaları seçiniz ({selectedCount} seçili)
              </Typography>
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <Stack spacing={2} sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {arızaList.map((arıza) => (
                  <FormControlLabel
                    key={arıza.checkCode}
                    control={
                      <Checkbox
                        checked={arıza.selected}
                        onChange={(e) => handleCheckboxChange(arıza.checkCode, e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body1">
                        {arıza.arıza}
                      </Typography>
                    }
                    sx={{
                      border: '1px solid',
                      borderColor: arıza.selected ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      p: 1,
                      m: 0,
                      backgroundColor: arıza.selected ? 'primary.light' : 'transparent',
                      '&:hover': {
                        backgroundColor: arıza.selected ? 'primary.light' : 'action.hover',
                      },
                    }}
                  />
                ))}
              </Stack>
            )}

            <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() => onClose?.({}, "backdropClick")}
                disabled={submitting}
              >
                İptal
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                endIcon={<MdCheckCircle />}
                onClick={handleSubmit}
                disabled={loading || submitting || selectedCount === 0}
              >
                {submitting ? "Kaydediliyor..." : `Seçilenleri Giderildi Olarak İşaretle (${selectedCount})`}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </DialogContent>
    </CustomDialog>
  );
};

export default ArızaChecklistModal;
