import PageDialog from "@/components/common/PageDialog";
import { incorrectButtons } from "./button";
import { useState } from "react";
import { MdSend } from "react-icons/md";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
} from "@mui/material";
import { useEmployee } from "@/store/features/employee";
import { useProduction } from "@/store/features/production";
import IncorrectRepository from "@/repositories/IncorrectProductRepository";
import ToastHelper from "@/utils/helpers/ToastHelper";

interface IProps {
  open: boolean;
  onClose: () => void;
}

interface IncorrectButtons {
  eksik: boolean;
  capak: boolean;
  delik: boolean;
  renk: boolean;
  leke: boolean;
  boyutKontrol: boolean;
  vakumKontrol: boolean;
  gazKirilmaKontrol: boolean;
  yirtmaKontrol: boolean;
  logoKontrol: boolean;
  montajKontrol: boolean;
  baskiSilinmeKontrol: boolean;
  sizdirmazlik: boolean;
  gramaj: boolean;
  acmaKapatma: boolean;
  cekmeBasma: boolean;
  pasoKilitUygunluk: boolean;
}

interface Description {
  eyeNumber: string;
  errorDesc: string;
  program: string;
}

export default function IncorrectProductModal({ onClose, open }: IProps) {
  const [state, setState] = useState<IncorrectButtons>({
    eksik: false,
    capak: false,
    delik: false,
    renk: false,
    leke: false,
    boyutKontrol: false,
    vakumKontrol: false,
    gazKirilmaKontrol: false,
    yirtmaKontrol: false,
    logoKontrol: false,
    montajKontrol: false,
    acmaKapatma: false,
    baskiSilinmeKontrol: false,
    cekmeBasma: false,
    gramaj: false,
    pasoKilitUygunluk: false,
    sizdirmazlik: false,
  });
  const [description, setDescription] = useState<Description>({
    errorDesc: "",
    eyeNumber: "",
    program: "",
  });

  const handleClick = (key: string, value: boolean) => {
    if (Object.hasOwn(state, key)) {
      setState({
        ...state,
        [key]: value,
      });
    }
  };

  const { employee, workOrder } = useEmployee();
  const { produced } = useProduction();

  const handleSubmit = () => {
    IncorrectRepository.sendIncorrect({
      employeeId: parseInt(employee!.staffCode),
      workOrder: workOrder!.isemrino,
      ciid: produced.toBeProducedItem.ciid.toString(),
      ...state,
      ...description,
    }).then(() => {
      ToastHelper.success("Başarıyla gönderildi");

      onClose();
    });
  };

  return (
    <PageDialog onClose={onClose} open={open} title="Uygunsuz Ürün">
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Göz Numarası"
                fullWidth
                value={description.eyeNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDescription({ ...description, eyeNumber: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Program"
                fullWidth
                value={description.program}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDescription({ ...description, program: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                rows={6}
                label="Açıklama"
                fullWidth
                value={description.errorDesc}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDescription({ ...description, errorDesc: e.target.value })
                }
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {incorrectButtons.map((item) => (
              <Grid key={item.key} item xs={2}>
                <Button
                  onClick={() => handleClick(item.key, !state[item.key])}
                  sx={{ height: 60 }}
                  fullWidth
                  color={state[item.key] ? "error" : "inherit"}
                  variant="contained"
                >
                  {item.title.toUpperCase()}
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            size="large"
            sx={{ height: 50 }}
            endIcon={<MdSend />}
            variant="contained"
            onClick={handleSubmit}
          >
            Gönder
          </Button>
        </CardActions>
      </Card>
    </PageDialog>
  );
}
