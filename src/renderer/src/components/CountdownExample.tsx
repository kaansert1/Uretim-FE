import { useCountdown } from "../hooks/useCountdown";
import { Button, Stack, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";

export default function CountdownExample() {
  const { timeLeft, start, stop, isRunning } = useCountdown();

  const handleStart = () => {
    // İsterseniz belirli bir tarihten başlatabilirsiniz
    const customDate = new Date();
    customDate.setHours(customDate.getHours() - 1); // 1 saat öncesinden başlat
    start(customDate);
  };

  return (
    <Stack spacing={2} alignItems="center">
      <Typography variant="h4">Geçen Süre: {timeLeft}</Typography>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlayArrowIcon />}
          onClick={handleStart}
          disabled={isRunning}
        >
          Başlat
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<StopIcon />}
          onClick={stop}
          disabled={!isRunning}
        >
          Durdur
        </Button>
      </Stack>
    </Stack>
  );
}
