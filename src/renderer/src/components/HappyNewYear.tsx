import { useEffect, useState } from "react";
import Snowfall from "react-snowfall";

type Props = {
  infinite?: boolean;
};

export default function HappyNewYear({ infinite }: Props) {
  const [time, setTime] = useState<number>(1);

  useEffect(() => {
    if (Boolean(infinite) || time === 30) return;

    const interval = setInterval(() => {
      setTime((prevCount) => prevCount + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  if (time === 30) return null;

  return <Snowfall snowflakeCount={500} radius={[0.5, 3]} />;
}
