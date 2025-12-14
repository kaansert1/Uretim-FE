import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ProductInputGroups from "@/pages/main/components/groups/ProductionInputGroups";
import SerialListGroup from "./components/groups/SerialListGroup";
import { useEmployee } from "@/store/features/employee";
import ProductionHelper from "@/utils/helpers/ProductionHelper";
import RemainingList from "./components/remaining/RemainingList";
import ProductionRepository from "@/repositories/ProductionRepository";
import BarcodeEntryModal from "@/components/modals/entry/BarcodeEntryModal";
import { BarrelListGroup } from "./components/groups/BarrelListGroup";

const MainPage: React.FC = () => {
  const [serialNumber, setSerialNumber] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const { machine, workOrder } = useEmployee();

  useEffect(() => {
    ProductionRepository.getProducedItems({
      workOrder: workOrder?.isemrino ?? "",
    }).then(({ data: result }) => {
      const items = result.data;

      if (items.length === 0) return;

      setSerialNumber(items[0].seriNo);
      setOpen(true);
    });
  }, []);

  return (
    <Box
      sx={{
        p: 2,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <RemainingList />
      <Box sx={{ flex: 1, gap: 4, alignItems: "center", display: "flex" }}>
        <Box sx={{ display: "flex", gap: 4, flexGrow: 1 }}>
          <ProductInputGroups />
          {(ProductionHelper.isMontage(machine?.description2 ?? "") && (
            <Box
              sx={{
                height: "100%",
                flex: "1",
              }}
            >
              <SerialListGroup />
            </Box>
          )) || <BarrelListGroup />}
        </Box>
      </Box>

      {open && (
        <BarcodeEntryModal
          serialNumber={serialNumber}
          open={open}
          onClose={() => {
            setOpen(false);
            setSerialNumber("");
          }}
        />
      )}
    </Box>
  );
};

export default MainPage;
