import CustomDialog from "@/components/common/CustomDialog";
import ProductionRepository from "@/repositories/ProductionRepository";
import store from "@/store";
import { fetchAssemblySeries, useAssembly } from "@/store/features/assembly";
import { useEmployee } from "@/store/features/employee";
import { clearScale } from "@/store/features/production";
import ToastHelper from "@/utils/helpers/ToastHelper";
import { IIncreasedLabelInfo } from "@/utils/interfaces/IIncreasedLabelInfo";
import { IncreasedLabel } from "@/utils/interfaces/enums/IncreasedLabel";
import {
  Button,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { MdNewLabel } from "react-icons/md";

type Props = {
  open: boolean;
  onClose: () => void;
  labelType: IncreasedLabel;
  info: IIncreasedLabelInfo;
};

type Scale = {
  amount: number;
  weigth: number;
};

type ScaleData = {
  dara: number;
  net: number;
};

export default function IncreasedLabelModal({
  open,
  onClose,
  labelType,
  info,
}: Props) {
  const [scale, setScale] = useState<Scale>({
    amount: 0,
    weigth: 0,
  });

  const { materials } = useAssembly();
  const { machine, workOrder } = useEmployee();

  useEffect(() => {
    window.electron.ipcRenderer.on("scale-data", (_, { net }: ScaleData) => {
      setScale({
        weigth: net,
        amount: (net / info.unitWeight) * 1000,
      });
    });

    return () => {
      store.dispatch(clearScale());
    };
  }, []);

  const getSeriesCount = useCallback(() => {
    if (labelType === IncreasedLabel.Alt) {
      return materials?.bodyMaterials?.data
        ? materials.bodyMaterials.data.length
        : 0;
    }

    return materials?.topMaterials?.data
      ? materials.topMaterials.data.length
      : 0;
  }, [materials]);

  const isNumberInRange = (number: number, min: number, max: number) => {
    return number >= min && number <= max;
  };

  const isDisabled = () => {
    if (scale.weigth <= 0) return true;

    if (getSeriesCount() === 1 && scale.weigth > info.maxAmount) return true;

    if (
      getSeriesCount() > 1 &&
      !isNumberInRange(
        Math.floor((scale.weigth / info.unitWeight) * 1000),
        info.minAmount,
        info.maxAmount
      )
    )
      return true;

    return false;
  };

  const handleClick = () => {
    ProductionRepository.increasedLabel({
      isBody: labelType === IncreasedLabel.Alt,
      macType: machine!.description2,
      netWeight: scale.weigth,
      workOrder: workOrder!.isemrino,
    }).then((result) => {
      const { data: slip } = result;

      window.electron.ipcRenderer.send("print-label", slip.data);
      store.dispatch(fetchAssemblySeries(workOrder!.isemrino));
      store.dispatch(clearScale());

      ToastHelper.success("Başarılı!");

      onClose();
    });
  };

  return (
    <CustomDialog
      title={`Artan Etiket (${labelType} Kapak)`}
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogContent sx={{ py: 6 }} dividers>
        <Grid container spacing={2} rowSpacing={4}>
          <Grid xs={6} item>
            <TextField
              variant="filled"
              label="Min Adet"
              fullWidth
              value={info.minAmount}
              InputProps={{
                readOnly: true,
                style: {
                  fontWeight: 600,
                },
              }}
            />
          </Grid>
          <Grid xs={6} item>
            <TextField
              variant="filled"
              label="Max Adet"
              fullWidth
              value={info.maxAmount}
              InputProps={{
                readOnly: true,
                style: {
                  fontWeight: 600,
                },
              }}
            />
          </Grid>
          <Grid xs={4} item>
            <TextField
              variant="outlined"
              label="Gramaj"
              fullWidth
              value={info.unitWeight}
              InputProps={{
                readOnly: true,
                style: {
                  fontWeight: 600,
                },
              }}
            />
          </Grid>
          <Grid xs={4} item>
            <TextField
              variant="outlined"
              label="Kilogram"
              fullWidth
              value={scale.weigth.toFixed(5)}
              InputProps={{
                readOnly: true,
                style: {
                  fontWeight: 600,
                },
              }}
            />
          </Grid>
          <Grid xs={4} item>
            <TextField
              variant="outlined"
              label="Adet"
              fullWidth
              value={Math.floor((scale.weigth / info.unitWeight) * 1000)}
              InputProps={{
                readOnly: true,
                style: {
                  fontWeight: 600,
                },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClick}
          disabled={isDisabled()}
          variant="contained"
          size="large"
          endIcon={<MdNewLabel />}
        >
          Etiket Al
        </Button>
      </DialogActions>
    </CustomDialog>
  );
}
