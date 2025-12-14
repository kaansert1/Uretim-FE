import CustomDialog from "@/components/common/CustomDialog";
import WorkOrderRepository from "@/repositories/WorkOrderRepository";
import { useEmployee } from "@/store/features/employee";
import { fireTypes } from "@/utils/data";
import { FireType } from "@/utils/enums/FireType";
import ProductionHelper from "@/utils/helpers/ProductionHelper";
import ToastHelper from "@/utils/helpers/ToastHelper";
import { IUygunsuzUrunLine } from "@/utils/interfaces/WorkOrder";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  onClose: () => void;
  onSubmit: (type: FireType, issue: IUygunsuzUrunLine) => void;
  open: boolean;
};

export default function ChooseFireTypeModal({
  onClose,
  open,
  onSubmit,
}: Props) {
  const [selectedType, setSelectedType] = useState<FireType | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<IUygunsuzUrunLine | null>(
    null
  );
  const [issues, setIssues] = useState<IUygunsuzUrunLine[]>([]);

  const { machine } = useEmployee();

  useEffect(() => {
    WorkOrderRepository.getUygunsuzUrunLines().then(({ data: result }) => {
      if (!ProductionHelper.isMontage(machine?.description2 as string))
        setSelectedType(FireType.Mamul);
      setIssues(result.data);
    });
  }, []);

  useEffect(() => {
    setSelectedIssue(null);
  }, [selectedType]);

  const handleSubmit = () => {
    if (selectedType === null || selectedIssue === null) {
      ToastHelper.error("Lütfen gerekli alanları seçiniz!");
      return;
    }

    onSubmit(selectedType, selectedIssue);
  };

  return (
    <CustomDialog
      onClose={onClose}
      open={open}
      title="Fire Tipi Seçiniz"
      fullWidth
      maxWidth="lg"
    >
      <DialogContent>
        <Stack direction="column" rowGap={4}>
          <Grid container columnGap={4}>
            {fireTypes.map((item, index) => (
              <Grid item key={index} sx={{ flexGrow: 1 }}>
                <Button
                  fullWidth
                  key={index}
                  disabled={
                    !ProductionHelper.isMontage(machine!.description2) &&
                    item.type !== FireType.Mamul
                  }
                  variant="contained"
                  onClick={() => setSelectedType(item.type)}
                  color={selectedType === item.type ? "primary" : "inherit"}
                  sx={{ height: 64 }}
                >
                  {item.title}
                </Button>
              </Grid>
            ))}
          </Grid>

          {selectedType !== null && (
            <Box>
              <Typography
                variant="subtitle1"
                color="GrayText"
                sx={{ marginBottom: 2 }}
              >
                Fire Detay Listesi
              </Typography>

              <Grid container spacing={2}>
                {issues.map((item, index) => (
                  <Grid item key={index} xs={2}>
                    <Button
                      fullWidth
                      key={index}
                      variant="contained"
                      onClick={() => setSelectedIssue(item)}
                      color={
                        selectedIssue?.siraNo === item.siraNo
                          ? "error"
                          : "inherit"
                      }
                      sx={{ height: 64 }}
                    >
                      {item.kriter}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleSubmit}
          variant="contained"
          size="large"
          disabled={selectedType === null || selectedIssue === null}
        >
          Onayla
        </Button>
      </DialogActions>
    </CustomDialog>
  );
}
