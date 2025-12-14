import CustomDialog from "@/components/common/CustomDialog";
import RpYardimLogRepository, { IRpYardimLog } from "@/repositories/RpYardimLogRepository";
import HelpResolveDialog from "./HelpResolveDialog";
import HelpAuthModal from "./HelpAuthModal";
import ArızaChecklistModal from "./ArızaChecklistModal";
import { useHelpRequest } from "@/store/features/helpRequest";
import { useEmployee } from "@/store/features/employee";
import ToastHelper from "@/utils/helpers/ToastHelper";
import { IEmployee } from "@/utils/interfaces/Employee";
import {
  Box,
  DialogContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/md";

type Props = {
  open: boolean;
  onClose: () => void;
};

const YardimLogListModal = ({ open, onClose }: Props) => {
  const [logs, setLogs] = useState<IRpYardimLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [resolveDialog, setResolveDialog] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<IRpYardimLog | null>(null);
  const [authModal, setAuthModal] = useState<boolean>(false);
  const [pendingLog, setPendingLog] = useState<IRpYardimLog | null>(null);
  const [arızaChecklistModal, setArızaChecklistModal] = useState<boolean>(false);

  const { resolvedRequests, resolveHelpRequest, helpRequests, getElapsedTimeForRequest, updateCurrentTime } = useHelpRequest();
  const { machine } = useEmployee(); // Makine bilgisini al

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // Makine koduna göre filtrelenmiş veri al
      const machineCode = machine?.machineCode;
      const response = await RpYardimLogRepository.getList(machineCode);

      // Response'u detaylı logla
      console.log("🔍 Full getList response:", response);
      console.log("🔍 Response data:", response.data);
      console.log("🔍 Machine code filter:", machineCode);

      // GetResponseOnlyResultData direkt array döndürür
      const allLogs = response.data || [];

      console.log("🔍 All logs:", allLogs);
      console.log("🔍 All logs length:", allLogs.length);

      // Sadece CözümTarihi NULL olan kayıtları filtrele
      const unresolvedLogs = allLogs.filter(log => !log.cözümTarihi);

      // Debug: Her kaydın durumunu logla
      unresolvedLogs.forEach(log => {
        console.log(`🔍 Log ${log.id}:`, log);
        console.log(`🔍 Log ${log.id}: CevapTarihi=${log.cevapTarihi}, CözümTarihi=${log.cözümTarihi}`);
      });

      setLogs(unresolvedLogs);
      console.log("✅ Backend'den yardım logları alındı:", allLogs.length, "toplam,", unresolvedLogs.length, "çözülmemiş", "Makine:", machineCode);
    } catch (error) {
      console.error("❌ Backend'den yardım logları alınamadı:", error);
      setLogs([]); // Backend çalışmıyorsa boş liste göster
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchLogs();
    }
  }, [open, helpRequests]); // helpRequests değiştiğinde de yeniden yükle

  // Timer güncellemesi için
  useEffect(() => {
    if (open) {
      const timerInterval = setInterval(() => {
        updateCurrentTime(Date.now());
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [open, updateCurrentTime]);

  const handleRowClick = (log: IRpYardimLog) => {
    // Eğer zaten çözülmüşse (CözümTarihi dolu) tıklanabilir olmasın
    if (log.cözümTarihi) {
      ToastHelper.info("Bu yardım isteği zaten çözülmüş.");
      return;
    }

    // Eğer zaten cevaplanmışsa (CevapTarihi dolu) login ekranını atla, direkt alert göster
    if (log.cevapTarihi) {
      handleDirectAlert(log);
      return;
    }

    // Henüz cevaplanmamışsa login ekranını aç
    setPendingLog(log);
    setAuthModal(true);
  };

  const handleDirectAlert = async (log: IRpYardimLog) => {
    // Cevaplanmış yardıma tıklandığında arıza checklist modalını aç
    console.log("🔄 Cevaplanmış yardıma tıklandı, arıza checklist açılıyor...", log.id);
    setPendingLog(log);
    setArızaChecklistModal(true);
  };

  const handleAuthSuccess = async (employee: IEmployee) => {
    if (!pendingLog) return;

    try {
      // Kayda tıklandığı anda CevapTarihi'ni güncelle (eğer henüz cevaplanmamışsa)
      if (!pendingLog.cevapTarihi) {
        console.log("🔄 CevapTarihi güncelleniyor (kayda tıklama)...", pendingLog.id);
        // STAFF_CODE'u CevapPersonel'e kaydet
        await RpYardimLogRepository.markAsAnswered(pendingLog.id, employee.staffCode);
        console.log("✅ CevapTarihi güncellendi (kayda tıklama)");
        ToastHelper.success("İlgili yardım cevaplandı olarak işaretlendi!");

        // Listeyi yenile (cevaplanmış durumu göstermek için)
        fetchLogs();

        // Auth modal'ı kapat - arıza checklist modal'ını AÇMA
        setAuthModal(false);
        setPendingLog(null);

        return; // Burada dur, arıza checklist modal'ını açma
      }

    } catch (error) {
      console.error("❌ Yardım isteği güncellenemedi:", error);
      ToastHelper.error("Yardım isteği güncellenirken hata oluştu!");
      setPendingLog(null);
    }
  };

  const handleArızaChecklistSubmit = async (selectedArızalar: string[]) => {
    if (!pendingLog) return;

    try {
      console.log("🔄 Seçilen arızalarla CözümTarihi güncelleniyor...", pendingLog.id, selectedArızalar);
      await RpYardimLogRepository.markAsResolvedWithArızalar(pendingLog.id, selectedArızalar);
      console.log("✅ CözümTarihi ve seçilen arızalar güncellendi");
      ToastHelper.success("Yardım isteği çözülmüş olarak işaretlendi!");

      // Listeyi yenile (kayıt listeden kaybolacak)
      fetchLogs();

      // Modal'ları kapat
      setArızaChecklistModal(false);
      setPendingLog(null);

    } catch (error) {
      console.error("❌ Yardım isteği güncellenemedi:", error);
      ToastHelper.error("Yardım isteği güncellenirken hata oluştu!");
    }
  };

  const handleResolve = (requestId: number) => {
    resolveHelpRequest(requestId);

    // Tüm istekler giderildi mi kontrol et
    const newResolvedCount = (resolvedRequests?.length || 0) + 1;
    const totalRequests = helpRequests.length;

    if (newResolvedCount >= totalRequests && totalRequests > 0) {
      ToastHelper.success("🎉 Tüm yardım istekleri giderildi! Timer sıfırlandı.");
    } else {
      ToastHelper.success("Yardım isteği giderildi olarak işaretlendi!");
    }

    setResolveDialog(false);
    setSelectedRequest(null);
  };

  const isResolved = (log: IRpYardimLog) => {
    // CözümTarihi dolu ise çözülmüş demektir
    return !!log.cözümTarihi;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Veritabanından gelen tarih artık Türkiye saatinde, timezone conversion yapmadan göster
      return date.toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch {
      return dateString;
    }
  };

  return (
    <CustomDialog
      title="Yardım İstekleri Listesi"
      maxWidth="lg"
      fullWidth
      open={open}
      onClose={onClose}
    >
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : logs.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
            Henüz yardım isteği bulunmamaktadır.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                    İş Emri No
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                    Personel ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                    Hata
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                    Süre
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                    Yardım Tarihi
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'white' }}>
                    Durum
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => {
                  const resolved = isResolved(log);
                  return (
                    <TableRow
                      key={log.id}
                      onClick={() => handleRowClick(log)}
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: resolved ? 'success.light' : 'action.hover'
                        },
                        '&:hover': {
                          backgroundColor: resolved ? 'success.main' : 'action.selected',
                          cursor: resolved ? 'default' : 'pointer'
                        },
                        backgroundColor: resolved ? 'success.light' : 'inherit',
                        opacity: resolved ? 0.7 : 1,
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {log.isEmriNo || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {log.personelID}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {log.hata || 'Belirtilmemiş'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: resolved ? 'success.light' : 'primary.light',
                          color: resolved ? 'success.contrastText' : 'primary.contrastText',
                          padding: '4px 8px',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          minWidth: '60px',
                        }}
                      >
                        {resolved ? '✅ Çözülmüş' : log.cevapTarihi ? '🔄 Cevaplanmış' : '⏳ Bekliyor'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(log.yardımTarihi)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {resolved && (
                          <Chip
                            icon={<MdCheckCircle />}
                            label="Çözülmüş"
                            size="small"
                            color="success"
                            variant="filled"
                          />
                        )}
                        {log.cözümTarihi && (
                          <Typography variant="caption" color="text.secondary">
                            Çözüm: {formatDate(log.cözümTarihi)}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <HelpResolveDialog
        open={resolveDialog}
        onClose={() => {
          setResolveDialog(false);
          setSelectedRequest(null);
        }}
        helpRequest={selectedRequest}
        onResolve={handleResolve}
      />

      <HelpAuthModal
        open={authModal}
        onClose={() => {
          setAuthModal(false);
          setPendingLog(null);
        }}
        onSuccess={handleAuthSuccess}
      />

      <ArızaChecklistModal
        open={arızaChecklistModal}
        onClose={() => {
          setArızaChecklistModal(false);
          setPendingLog(null);
        }}
        onSubmit={handleArızaChecklistSubmit}
      />
    </CustomDialog>
  );
};

export default YardimLogListModal;
