import RightButton from "@/components/buttons/RightButton";
import ChooseFireTypeModal from "@/components/modals/chose/ChooseFireTypeModal";
import PasswordEntryModal from "@/components/modals/entry/PasswordEntryModal";
import WorkOrderRepository from "@/repositories/WorkOrderRepository";
import store from "@/store";
import { useEmployee } from "@/store/features/employee";
import {
  fetchMinMaxValue,
  setProductionType,
  setUw,
  useProduction,
} from "@/store/features/production";
import { FireType } from "@/utils/enums/FireType";
import ProductionHelper from "@/utils/helpers/ProductionHelper";
import { ProductionType } from "@/utils/interfaces/enums/ProductionType";
import { IUygunsuzUrunLine } from "@/utils/interfaces/WorkOrder";
import { useState } from "react";

const FireButton = () => {
  const [passwordDialog, setPasswordDialog] = useState<boolean>(false);
  const [dialog, setDialog] = useState<boolean>(false);

  const { workOrder, machine } = useEmployee();
  const { productionType } = useProduction();

  const handleClose = () => {
    store.dispatch(
      setProductionType({
        data: ProductionType.Uretim,
        fireType: undefined,
        issue: undefined,
      })
    );

    setDialog(false);
  };

  const handleConfirmPassword = (password) => {
    const valid = ProductionHelper.login(password, productionType);

    if (!valid) {
      setProductionType({
        data: ProductionType.Uretim,
        fireType: undefined,
        issue: undefined,
      });
      setPasswordDialog(false);

      return;
    }

    setPasswordDialog(false);
    setDialog(true);
  };

  const handleSubmit = (fireType: FireType, issue: IUygunsuzUrunLine) => {
    if (fireType === FireType.Mamul) {
      store.dispatch(fetchMinMaxValue(workOrder?.isemrino as string));
      store.dispatch(
        setProductionType({ data: ProductionType.Fire, fireType, issue })
      );

      setDialog(false);
      return;
    }

    WorkOrderRepository.getBodyTopUw(workOrder?.isemrino as string, fireType)
      .then(({ data: result }) => {
        store.dispatch(setUw(result.data));

        store.dispatch(
          setProductionType({ data: ProductionType.Fire, fireType, issue })
        );
      })
      .catch(() => {
        setProductionType({
          data: ProductionType.Uretim,
          fireType: undefined,
          issue: undefined,
        });
      })
      .finally(() => setDialog(false));
  };

  return (
    <>
      {passwordDialog && (
        <PasswordEntryModal
          onClose={handleConfirmPassword}
          open={passwordDialog}
        />
      )}
      {dialog && (
        <ChooseFireTypeModal
          open={dialog}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
      )}
      <RightButton
        disabled={ProductionHelper.isRenkGecisi(workOrder?.yapkod ?? "")}
        onClick={() => setPasswordDialog(true)}
        value={ProductionType.Fire}
      >
        FİRE
      </RightButton>
    </>
  );
};

export default FireButton;
