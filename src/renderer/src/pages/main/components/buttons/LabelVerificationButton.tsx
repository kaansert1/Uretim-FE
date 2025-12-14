import BottomButton from "@/components/buttons/BottomButton";
import BarcodeEntryModal from "@/components/modals/entry/BarcodeEntryModal";
import ProductionRepository from "@/repositories/ProductionRepository";
import { useEmployee } from "@/store/features/employee";
import ToastHelper from "@/utils/helpers/ToastHelper";
import React, { useState } from "react";
import { MdBarcodeReader } from "react-icons/md";

export default function LabelVerificationButton() {
  const [serialNumber, setSerialNumber] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const { workOrder } = useEmployee();

  const handleClick = () => {
    ProductionRepository.getProducedItems({
      workOrder: workOrder?.isemrino ?? "",
    }).then(({ data: result }) => {
      const items = result.data;

      if (items.length === 0) {
        ToastHelper.success("Doğrulanmamış etiket bulunamadı");
        return;
      }

      setSerialNumber(items[0].seriNo);
      setOpen(true);
    });
  };

  return (
    <React.Fragment>
      <BottomButton
        variant="contained"
        icon={<MdBarcodeReader size={32} />}
        onClick={handleClick}
      >
        Etiket Doğrula
      </BottomButton>

      {open && (
        <BarcodeEntryModal
          open={true}
          onClose={() => {
            setOpen(false);
            setSerialNumber("");
          }}
          serialNumber={serialNumber}
        />
      )}
    </React.Fragment>
  );
}
