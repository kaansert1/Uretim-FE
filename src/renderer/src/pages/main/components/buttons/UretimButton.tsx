import RightButton from "@/components/buttons/RightButton";
import { useNumuneContext } from "@/contexts/NumuneContext";
import { useEmployee } from "@/store/features/employee";
import ProductionHelper from "@/utils/helpers/ProductionHelper";
import { ProductionType } from "@/utils/interfaces/enums/ProductionType";

const UretimButton = () => {
  const { workOrder } = useEmployee();
  const { isMandatory } = useNumuneContext();

  return (
    <>
      <RightButton
        disabled={
          ProductionHelper.isRenkGecisi(workOrder?.yapkod ?? "") || isMandatory
        }
        value={ProductionType.Uretim}
      >
        ÜRETİM
      </RightButton>
    </>
  );
};

export default UretimButton;
