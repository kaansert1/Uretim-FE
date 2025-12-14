import CustomDialog from "@/components/common/CustomDialog";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useMemo, useState } from "react";
import { useEmployee } from "@/store/features/employee";
import { useHelpRequest, type HelpRequest } from "@/store/features/helpRequest";
import MailRepository from "@/repositories/MailRepository";
import RpYardimLogRepository from "@/repositories/RpYardimLogRepository";
import ToastHelper from "@/utils/helpers/ToastHelper";
import { MESSAGES } from "@/utils/constants";
import ProductionHelper from "@/utils/helpers/ProductionHelper";

type Props = {
  open: boolean;
  onClose: () => void;
};

type Issue = "Seri" | "Terazi" | "Yazici";

type HelpIssue = {
  title: string;
  value: Issue;
};

const HelpFormModal = ({ ...props }: Props) => {
  const [capType, setCapType] = useState<number | null>(0);
  const [amount, setAmount] = useState<string | null>(null);

  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const { workOrder, machine, employee } = useEmployee();
  const { incrementHelpRequestCount, addHelpRequest } = useHelpRequest();

  const issiueList = [
    {
      title: "Seri İhtiyacı",
      value: "Seri",
    },
    {
      title: "Terazi Hatası",
      value: "Terazi",
    },
    {
      title: "Yazıcı Hatası",
      value: "Yazici",
    },
  ] as Array<HelpIssue>;

  const filteredList = useMemo(() => {
    const list = [...issiueList];

    if (!ProductionHelper.isMontage(machine?.description2 ?? "")) {
      return list.filter((x) => x.value !== "Seri");
    }

    return list;
  }, [machine?.description2]);

  const handleClick = async () => {
    const issue = issiueList.find((x) => x.value === selectedIssue);

    if (!issue) return;

    const sendAmount = amount ? parseInt(amount) : 0;

    if (issue.value === "Seri" && (sendAmount <= 0 || sendAmount > 20)) {
      ToastHelper.error("Girilen Koli Adeti 0 ila 20 arasında olmalıdır.");

      return;
    }

    const hostName = await window.api.getHostName();

    // Mail gönderme
    MailRepository.sendAsync({
      subject: issue.value,
      body: `${machine?.machineCode ?? 0} - ${hostName} - ${issue.title}`,
      serialDetail:
        selectedIssue === "Seri"
          ? {
              isemrino: workOrder?.isemrino ?? "",
              koliAdeti: amount ? parseInt(amount) : 0,
              urunTip: Boolean(capType),
            }
          : null,
    }).then(() => {
      ToastHelper.success(MESSAGES["send-mail"]);

      // Global state'i güncelle - yardım isteği gönderildi (mail başarılı olduğunda)
      console.log("Mail başarılı, incrementHelpRequestCount çağrılıyor...");
      incrementHelpRequestCount();
      console.log("incrementHelpRequestCount çağrıldı");

      // Yardım isteğini store'a kaydet
      const helpRequestData: Omit<HelpRequest, 'id' | 'timerStartTime'> = {
        isEmriNo: workOrder?.isemrino ?? "",
        personelID: employee?.id?.toString() ?? "0",
        yardımTarihi: new Date().toISOString(),
        // Ek bilgiler (localStorage için)
        subject: issue.value,
        machineCode: machine?.machineCode ?? "",
        hostName: hostName,
      };

      addHelpRequest(helpRequestData);
      console.log("✅ Yardım isteği store'a kaydedildi:", helpRequestData);

      // RpYardımLog tablosuna kayıt ekleme (backend hazır olduğunda)
      const yardimLogData = {
        isEmriNo: workOrder?.isemrino ?? "",
        personelID: employee?.id?.toString() ?? "0",
        machineCode: machine?.machineCode ?? "", // Makine kodu eklendi
        hata: issue.value, // Hata tipini gönder
      };

      console.log("🔍 Yardım log verisi gönderiliyor:", yardimLogData);
      console.log("🔍 Machine object:", machine);
      console.log("🔍 Machine code:", machine?.machineCode);

      RpYardimLogRepository.create(yardimLogData).then(() => {
        console.log("✅ Yardım log başarıyla veri tabanına kaydedildi");
        ToastHelper.success("Yardım isteği veri tabanına kaydedildi!");
      }).catch((error) => {
        console.error("❌ Yardım log kaydedilemedi:", error);
        console.log("🔧 Backend henüz hazır değil veya bağlantı sorunu var");

        // Backend hazır değilse kullanıcıya bilgi ver
        if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          ToastHelper.info("Backend servisi henüz hazır değil. Mail gönderildi ancak log kaydedilemedi.");
        } else {
          ToastHelper.info("Yardım isteği gönderildi ancak log kaydedilemedi.");
        }
      });

      props.onClose();
    });
  };

  useEffect(() => {
    if (selectedIssue !== "Seri") {
      setCapType(0);
      setAmount(null);
    }
  }, [selectedIssue]);

  return (
    <CustomDialog title="Yardım" maxWidth="md" fullWidth {...props}>
      <DialogContent>
        <Stack direction="row" spacing={4}>
          {filteredList.map((issue) => (
            <Button
              key={issue.value}
              sx={{ flexGrow: 1, height: 64 }}
              variant="contained"
              onClick={() => setSelectedIssue(issue.value)}
              color={selectedIssue === issue.value ? "info" : "inherit"}
            >
              {issue.title}
            </Button>
          ))}
        </Stack>

        {selectedIssue === "Seri" && (
          <Box component={Paper} sx={{ mt: 4, p: 4 }}>
            <form>
              <Stack direction="column" spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Kapak Tipi</InputLabel>
                  <Select
                    label="Kapak Tipi"
                    value={capType}
                    onChange={(event) => setCapType(event.target.value as any)}
                  >
                    <MenuItem value={0} sx={{ height: 64 }}>
                      Alt Kapak
                    </MenuItem>
                    <MenuItem value={1} sx={{ height: 64 }}>
                      Üst Kapak
                    </MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Koli Adeti"
                  fullWidth
                  type="number"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
              </Stack>
            </form>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClick}
          variant="contained"
          size="large"
          startIcon={<SendIcon />}
          disabled={(selectedIssue === "Seri" && !amount) || !selectedIssue}
        >
          Gönder
        </Button>
      </DialogActions>
    </CustomDialog>
  );
};

export default HelpFormModal;
