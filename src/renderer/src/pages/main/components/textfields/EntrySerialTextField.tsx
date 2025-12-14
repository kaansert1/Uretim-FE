import { TextField, InputAdornment, SxProps, Theme } from "@mui/material";
import { useState, forwardRef, useRef } from "react";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";

import { useLoader } from "@/store/features/loader";
import ToastHelper from "@/utils/helpers/ToastHelper";

interface IEntrySerialTextFieldProps {
  handleKeyUp: (serialNo: string) => void;
  sx?: SxProps<Theme>;
}

const EntrySerialTextField = forwardRef<
  HTMLInputElement,
  IEntrySerialTextFieldProps
>(({ handleKeyUp, sx }, ref) => {
  const [value, setValue] = useState<string>("");

  const { isLoading } = useLoader();
  const lastInputDateRef = useRef<number | null>(null);

  const handleKeydown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (value !== "" && e.code === "Enter") {
      console.log("__DELAY__", Date.now() - lastInputDateRef.current!);

      if (Date.now() - lastInputDateRef.current! > 50) {
        ToastHelper.error("Lütfen etiketi barkod makinesi ile doğrulayınız!");
        setValue("");
        return;
      }

      handleKeyUp(value);
      setValue("");
    }
  };

  const handleChange = () => {
    lastInputDateRef.current = Date.now();
  };

  return (
    <TextField
      onKeyDown={handleKeydown}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        handleChange();
      }}
      fullWidth
      value={value}
      disabled={isLoading}
      inputRef={ref}
      placeholder="Lütfen seri okutunuz."
      label="Seri Numarası"
      sx={sx}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <DocumentScannerIcon />
          </InputAdornment>
        ),
      }}
    />
  );
});

export default EntrySerialTextField;
