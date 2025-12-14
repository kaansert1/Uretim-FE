import { Box, Stack } from "@mui/material";
import { useEffect, useRef } from "react";
import EntrySerialTextField from "../textfields/EntrySerialTextField";
import { useEmployee } from "@/store/features/employee";
import AssemblyTable from "../table/AssemblyTable";
import { SerialType } from "@/utils/enums/SerialType";
import store from "@/store";
import { setMaterials, useAssembly } from "@/store/features/assembly";
import AssemblyRepository from "@/repositories/AssemblyRepository";

const SerialListGroup = () => {
  var { materials } = useAssembly();
  var { workOrder } = useEmployee();

  const inputRef = useRef<HTMLInputElement>(null);

  const getAssemblySeries = () => {
    AssemblyRepository.getAllSeries(workOrder?.isemrino ?? "").then(
      (response) => {
        store.dispatch(setMaterials(response.data.data));
      }
    );
  };

  const handleKeyUp = (serialNo: string) => {
    AssemblyRepository.getSerial({
      serialNo,
      workOrder: workOrder?.isemrino ?? "",
    })
      .then((response) => {
        store.dispatch(setMaterials(response.data.data));
      })
      .finally(() => inputRef.current?.focus());
  };

  useEffect(() => {
    getAssemblySeries();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
      <Stack direction="column" rowGap={2}>
        <EntrySerialTextField handleKeyUp={handleKeyUp} ref={inputRef} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: 2,
          }}
        >
          <Stack direction="column" rowGap={2}>
            <AssemblyTable
              type={SerialType.top}
              data={materials?.topMaterials ?? null}
            />
            <AssemblyTable
              type={SerialType.bottom}
              data={materials?.bodyMaterials ?? null}
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default SerialListGroup;
