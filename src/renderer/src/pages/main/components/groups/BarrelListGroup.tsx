import { Box, Stack } from "@mui/material";
import { BarrelListTable } from "../table/BarrelListTable";
import EntrySerialTextField from "../textfields/EntrySerialTextField";
import { useEffect, useState, useRef } from "react";
import BarrelRepository from "@/repositories/BarrelRepository";
import { IBarrel } from "@/utils/interfaces/Barrel";
import { useEmployee } from "@/store/features/employee";

export const BarrelListGroup = () => {
  const [barrelList, setBarrelList] = useState<IBarrel[]>([]);

  const { workOrder } = useEmployee();
  const inputRef = useRef<HTMLInputElement>(null);

  const getBarrelList = () => {
    BarrelRepository.getBarrelList(workOrder?.isemrino ?? "").then((res) => {
      setBarrelList(res.data.data);
    });
  };

  const handleKeyUp = (serialNo: string) => {
    BarrelRepository.verifyBarrel(serialNo, workOrder?.isemrino ?? "")
      .then(() => getBarrelList())
      .finally(() => inputRef.current?.focus());
  };

  useEffect(() => {
    getBarrelList();
  }, []);

  return (
    <Stack direction="column" rowGap={2} flexGrow={1}>
      <EntrySerialTextField handleKeyUp={handleKeyUp} ref={inputRef} />

      <BarrelListTable barrelList={barrelList} onRefresh={getBarrelList} />
    </Stack>
  );
};
