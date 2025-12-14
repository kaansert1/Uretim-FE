import { useState, useEffect, useCallback, useRef } from "react";

interface CountdownResult {
  timeLeft: string;
  start: (date?: Date) => void;
  stop: () => void;
  isRunning: boolean;
}

export const useCountdown = (): CountdownResult => {
  const [timeLeft, setTimeLeft] = useState<string>("00:00:00");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const startTimeRef = useRef<Date>(new Date());
  const elapsedTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const calculateTimeLeft = useCallback(() => {
    if (!isRunning) return;

    const now = new Date();
    const difference =
      now.getTime() - startTimeRef.current.getTime() + elapsedTimeRef.current;

    // Saat, dakika ve saniye hesaplama
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // İki haneli formata çevirme
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    const newTimeLeft = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

    // Sadece değişiklik varsa state'i güncelle
    if (newTimeLeft !== timeLeft) {
      setTimeLeft(newTimeLeft);
      lastUpdateRef.current = Date.now();
    }
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (isRunning) {
      calculateTimeLeft();
      timerRef.current = setInterval(calculateTimeLeft, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, calculateTimeLeft]);

  const start = useCallback(
    (date?: Date) => {
      if (!isRunning) {
        startTimeRef.current = date || new Date();
        elapsedTimeRef.current = 0;
        setIsRunning(true);
      }
    },
    [isRunning]
  );

  const stop = useCallback(() => {
    if (isRunning) {
      const now = new Date();
      elapsedTimeRef.current += now.getTime() - startTimeRef.current.getTime();
      setIsRunning(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRunning]);

  return { timeLeft, start, stop, isRunning };
};
