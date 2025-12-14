import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HelpRequest {
  id: number;
  isEmriNo: string;
  personelID: string;
  yardımTarihi: string;
  cevapTarihi?: string;
  cevapPersonel?: string;
  cözümTarihi?: string;
  timerStartTime: number; // Her isteğin kendi timer başlangıcı
  // Ek bilgiler (localStorage için)
  subject?: string;
  machineCode?: string;
  hostName?: string;
}

interface HelpRequestState {
  hasHelpRequest: boolean;
  helpRequestCount: number;
  currentTime: number; // current timestamp for timer calculation
  resolvedRequests: number[]; // resolved help request IDs
  helpRequests: HelpRequest[]; // stored help requests
}

// localStorage'dan veri yükle
const loadFromStorage = (): HelpRequestState => {
  try {
    const stored = localStorage.getItem('helpRequestState');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        hasHelpRequest: parsed.hasHelpRequest || false,
        helpRequestCount: parsed.helpRequestCount || 0,
        currentTime: Date.now(), // currentTime'ı her zaman güncel tut
        resolvedRequests: parsed.resolvedRequests || [], // Güvenli fallback
        helpRequests: parsed.helpRequests || [], // Güvenli fallback
      };
    }
  } catch (error) {
    console.error('localStorage okuma hatası:', error);
  }

  return {
    hasHelpRequest: false,
    helpRequestCount: 0,
    currentTime: Date.now(),
    resolvedRequests: [],
    helpRequests: [],
  };
};

const initialState: HelpRequestState = loadFromStorage();

// localStorage'a kaydet
const saveToStorage = (state: HelpRequestState) => {
  try {
    localStorage.setItem('helpRequestState', JSON.stringify(state));
  } catch (error) {
    console.error('localStorage yazma hatası:', error);
  }
};

const helpRequestSlice = createSlice({
  name: "helpRequest",
  initialState,
  reducers: {
    setHasHelpRequest: (state, action: PayloadAction<boolean>) => {
      state.hasHelpRequest = action.payload;
      saveToStorage(state);
    },
    incrementHelpRequestCount: (state) => {
      state.helpRequestCount += 1;
      state.hasHelpRequest = true;
      saveToStorage(state);
    },
    addHelpRequest: (state, action: PayloadAction<Omit<HelpRequest, 'id' | 'timerStartTime'>>) => {
      const newRequest: HelpRequest = {
        ...action.payload,
        id: Date.now(), // Basit ID üretimi
        timerStartTime: Date.now(), // Her isteğin kendi timer'ı
      };
      state.helpRequests.push(newRequest);

      // Yardım isteği eklendiğinde state'i güncelle
      state.hasHelpRequest = true;

      console.log("✅ Yardım isteği eklendi, hasHelpRequest = true");
      saveToStorage(state);
    },
    setHelpRequestCount: (state, action: PayloadAction<number>) => {
      state.helpRequestCount = action.payload;
      state.hasHelpRequest = action.payload > 0;
      saveToStorage(state);
    },
    updateCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
      // currentTime güncellemelerinde localStorage'a kaydetme (performans için)
    },
    resolveHelpRequest: (state, action: PayloadAction<number>) => {
      const requestId = action.payload;
      if (!state.resolvedRequests.includes(requestId)) {
        state.resolvedRequests.push(requestId);
      }

      // Tüm yardım istekleri giderildi mi kontrol et
      const totalRequests = state.helpRequests.length;
      const resolvedCount = state.resolvedRequests.length;

      console.log(`📊 Giderilme durumu: ${resolvedCount}/${totalRequests}`);

      // Eğer tüm yardım istekleri giderildiyse hasHelpRequest'i false yap
      if (totalRequests > 0 && resolvedCount >= totalRequests) {
        console.log("🎉 Tüm yardım istekleri giderildi! Buton gizleniyor...");
        state.hasHelpRequest = false;
        state.currentTime = Date.now();
      }

      saveToStorage(state);
    },
    resetHelpRequest: (state) => {
      state.hasHelpRequest = false;
      state.helpRequestCount = 0;
      state.currentTime = Date.now();
      state.resolvedRequests = [];
      state.helpRequests = [];
      saveToStorage(state);
      console.log("🔄 Yardım istekleri ve sayaç sıfırlandı");
    },
    clearAllData: (state) => {
      // Tüm verileri tamamen sıfırla
      state.hasHelpRequest = false;
      state.helpRequestCount = 0;
      state.currentTime = Date.now();
      state.resolvedRequests = [];
      state.helpRequests = [];
      saveToStorage(state);
      console.log("🧹 Tüm yardım verileri temizlendi");
    },
  },
});

export const {
  setHasHelpRequest,
  incrementHelpRequestCount,
  setHelpRequestCount,
  addHelpRequest,
  updateCurrentTime,
  resolveHelpRequest,
  resetHelpRequest,
  clearAllData,
} = helpRequestSlice.actions;

export default helpRequestSlice.reducer;

// Hook
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";

export const useHelpRequest = () => {
  const dispatch = useDispatch();
  const helpRequest = useSelector((state: RootState) => state.helpRequest);

  // Her yardım isteği için timer hesaplama fonksiyonu
  const getElapsedTimeForRequest = (requestId: number) => {
    const request = helpRequest.helpRequests.find(req => req.id === requestId);
    if (!request) return "00:00";

    const elapsed = helpRequest.currentTime - request.timerStartTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    ...helpRequest,
    getElapsedTimeForRequest,
    setHasHelpRequest: (hasRequest: boolean) => dispatch(setHasHelpRequest(hasRequest)),
    incrementHelpRequestCount: () => dispatch(incrementHelpRequestCount()),
    setHelpRequestCount: (count: number) => dispatch(setHelpRequestCount(count)),
    addHelpRequest: (request: Omit<HelpRequest, 'id' | 'timerStartTime'>) => dispatch(addHelpRequest(request)),
    updateCurrentTime: (time: number) => dispatch(updateCurrentTime(time)),
    resolveHelpRequest: (requestId: number) => dispatch(resolveHelpRequest(requestId)),
    resetHelpRequest: () => dispatch(resetHelpRequest()),
    clearAllData: () => dispatch(clearAllData()),
  };
};

// HelpRequest tipini export edelim
export type { HelpRequest };
