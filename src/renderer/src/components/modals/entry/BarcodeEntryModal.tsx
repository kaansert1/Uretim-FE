import CustomDialog from "@/components/common/CustomDialog";
import AssemblyRepository from "@/repositories/AssemblyRepository";
import ProductionRepository from "@/repositories/ProductionRepository";
import store from "@/store";
import { setMaterials } from "@/store/features/assembly";
import { useEmployee } from "@/store/features/employee";
import { useLoader } from "@/store/features/loader";
import { fetchRemaingValue } from "@/store/features/production";
import ToastHelper from "@/utils/helpers/ToastHelper";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import {
  Card,
  CardContent,
  colors,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  serialNumber: string;
  onClose: () => void;
  closable?: boolean;
};

export default function BarcodeEntryModal({
  onClose,
  serialNumber,
  open,
}: Props) {
  const { isLoading } = useLoader();
  const { workOrder } = useEmployee();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastInputDateRef = useRef<number | null>(null);

  const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      console.log("__DELAY__", Date.now() - lastInputDateRef.current!);

      if (Date.now() - lastInputDateRef.current! > 50) {
        ToastHelper.error("Lütfen etiketi barkod makinesi ile doğrulayınız!");
        inputRef.current!.value = "";
        return;
      }

      ProductionRepository.producedLabelControl(
        inputRef.current?.value.toUpperCase().replaceAll("İ", "I") ?? "",
        workOrder?.isemrino ?? ""
      )
        .then(async () => {
          store.dispatch(fetchRemaingValue(parseInt(workOrder!.yedek2)));
          onClose();
        })
        .finally(() => {
          inputRef.current!.value = "";
          inputRef.current?.focus();
        });
    }
  };

  const handleChange = () => {
    lastInputDateRef.current = Date.now();
  };

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <CustomDialog
      closable={true}
      title={`Etiket Doğrulama - (${serialNumber})`}
      open={open}
      onClose={() => onClose()}
      fullWidth
      maxWidth="lg"
    >
      <DialogContent>
        <Card variant="elevation">
          <CardContent>
            <Typography variant="h6">Seri Numarası</Typography>
            <Typography variant="body1" color={colors.grey[600]}>
              Etiket üzerinde bulunan seri numarasını okutunuz.
            </Typography>

            <TextField
              label="Seri Numarası"
              autoFocus
              fullWidth
              onContextMenu={(e) => e.preventDefault()}
              onBlur={() => inputRef.current?.focus()}
              onKeyDown={handleKeydown}
              onChange={handleChange}
              inputRef={inputRef}
              disabled={isLoading}
              InputProps={{
                startAdornment: <DocumentScannerIcon sx={{ mr: 1 }} />,
              }}
              sx={{ mt: 3 }}
            />
          </CardContent>
        </Card>
      </DialogContent>
    </CustomDialog>
  );
}
