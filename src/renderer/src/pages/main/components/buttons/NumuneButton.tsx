import RightButton from "@/components/buttons/RightButton";
import PasswordEntryModal from "@/components/modals/entry/PasswordEntryModal";
import { useEmployee } from "@/store/features/employee";
import ProductionHelper from "@/utils/helpers/ProductionHelper";
import { ProductionType } from "@/utils/interfaces/enums/ProductionType";
import { useState } from "react";
import { useNumuneContext } from "@/contexts/NumuneContext";

const NumuneButton = () => {
  const [dialog, setDialog] = useState<boolean>(false);
  const { workOrder } = useEmployee();
  const { isMandatory } = useNumuneContext();

  const handleClose = (password: string) => {
    ProductionHelper.login(
      password,
      ProductionType.Numune,
      workOrder?.yapkod ?? ""
    );
    setDialog(false);
  };

  return (
    <>
      <PasswordEntryModal open={dialog} onClose={handleClose} />
      <RightButton
        onClick={() => setDialog(true)}
        value={ProductionType.Numune}
      >
        {isMandatory ? "NUMUNE (ZORUNLU)" : "NUMUNE"}
      </RightButton>
    </>
  );
};

export default NumuneButton;
