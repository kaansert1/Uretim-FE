import BottomButton from "@/components/buttons/BottomButton";
import RpYardimLogRepository from "@/repositories/RpYardimLogRepository";
import YardimLogListModal from "@/components/modals/help/YardimLogListModal";
import { useHelpRequest } from "@/store/features/helpRequest";
import { useEmployee } from "@/store/features/employee";
import { Badge, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { MdNotifications } from "react-icons/md";

const YardimSayacButton = () => {
  const { setHelpRequestCount } = useHelpRequest();
  const { machine } = useEmployee(); // Makine bilgisini al
  const [dialog, setDialog] = useState<boolean>(false);
  const [backendCount, setBackendCount] = useState<number>(0);

  const fetchCount = async () => {
    try {
      // Cache bypass için timestamp ekle
      const timestamp = Date.now();
      const machineCode = machine?.machineCode;
      console.log("🔄 Count API çağrısı yapılıyor...", timestamp, "Makine:", machineCode);
      const response = await RpYardimLogRepository.getCount(machineCode);

      // Response'u detaylı logla
      console.log("🔍 Full response:", response);
      console.log("🔍 Response data:", response.data);

      // GetResponseOnlyResultData direkt sayı döndürür
      const count = response.data || 0;
      setBackendCount(count);
      setHelpRequestCount(count);
      console.log("✅ Backend'den yardım sayısı alındı:", count, "timestamp:", timestamp, "Makine:", machineCode);
    } catch (error) {
      console.error("❌ Yardım sayısı alınamadı:", error);
      setBackendCount(0);
    }
  };

  useEffect(() => {
    // Sayfa yüklendiğinde backend'den count al
    fetchCount();

    // Her 5 saniyede bir sayıyı güncelle (daha sık kontrol)
    const countInterval = setInterval(fetchCount, 5000);

    return () => {
      clearInterval(countInterval);
    };
  }, []);

  const handleClick = () => {
    setDialog(true);
  };

  // Backend'den count 0 ise butonu gösterme
  if (backendCount === 0) {
    console.log("❌ Backend'de yardım isteği yok, buton gizleniyor");
    return null;
  }

  return (
    <>
      {dialog && (
        <YardimLogListModal open={dialog} onClose={() => setDialog(false)} />
      )}
      <Badge
        badgeContent={backendCount}
        color="error"
        max={99}
        sx={{
          '& .MuiBadge-badge': {
            right: 8,
            top: 8,
            fontSize: '0.75rem',
            minWidth: '20px',
            height: '20px',
          }
        }}
      >
        <BottomButton
          onClick={handleClick}
          icon={<MdNotifications size={32} />}
          color="warning"
          sx={{
            minWidth: '80px',
          }}
        >
          Yardım Log
        </BottomButton>
      </Badge>
    </>
  );
};

export default YardimSayacButton;
