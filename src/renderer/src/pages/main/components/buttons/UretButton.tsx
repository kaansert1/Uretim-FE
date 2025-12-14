import BottomButton from "@/components/buttons/BottomButton";
import { ProductionType } from "@/utils/interfaces/enums/ProductionType";
import { green } from "@mui/material/colors";
import { MdGavel } from "react-icons/md";
import { useCallback, useMemo, useState } from "react";
import ProductionRepository from "@/repositories/ProductionRepository";
import { useEmployee } from "@/store/features/employee";
import moment from "moment";
import EmployeeHelper from "@/utils/helpers/EmployeeHelper";
import ProductionHelper from "@/utils/helpers/ProductionHelper";
import ScaleHelper from "@/utils/helpers/ScaleHelper";
import {
  clearScale,
  fetchMinMaxValue,
  fetchRemaingValue,
  useProduction,
} from "@/store/features/production";
import store from "@/store";
import { setMaterials } from "@/store/features/assembly";
import { _add, _remove, useLoader } from "@/store/features/loader";
import AssemblyRepository from "@/repositories/AssemblyRepository";
import BarcodeEntryModal from "@/components/modals/entry/BarcodeEntryModal";
import ToastHelper from "@/utils/helpers/ToastHelper";
import { useNumuneContext } from "@/contexts/NumuneContext";

const UretButton = () => {
  const [serialNumber, setSerialNumber] = useState<string | null>(null);
  const { isLoading } = useLoader();

  const { productionType, terazi, minMax, fireType, fireIssue } =
    useProduction();
  const { employee, machine, workOrder } = useEmployee();
  const { setIsMandatory } = useNumuneContext();

  // TODO: URETIME BELİRLİ TIMEOUT

  const refetchGrid = () => {
    AssemblyRepository.getAllSeries(workOrder?.isemrino ?? "").then(
      (response) => {
        store.dispatch(setMaterials(response.data.data));
      }
    );
  };

  const getFireTypeName = useCallback(() => {
    switch (fireType) {
      case 0:
        return "Product";
      case 1:
        return "Body";
      case 2:
        return "Top";
      default:
        return "Product";
    }
  }, [fireType]);

  const handleClick = async () => {
    const shift = EmployeeHelper.getShift();
    const hostName = await window.api.getHostName();

    ProductionRepository.addProduction({
      adet: terazi.adet,
      bAgirlik: minMax.birimAgirlik,
      brut: terazi.brut,
      ciid: workOrder!.yedek2,
      dara: terazi.dara,
      isemriNo: workOrder!.isemrino,
      lotNo: `${moment().format(
        "YYYYMMDD"
      )}${shift}${EmployeeHelper.getFormattedWorkorder(workOrder!.isemrino)}`,
      makId: parseInt(machine!.machineCode),
      net: terazi.net,
      personelId: parseInt(employee!.staffCode),
      stokKodu: workOrder!.stokKodu,
      terazi: hostName,
      uretTip: productionType,
      vardiya: shift.toString(),
      yapKod: workOrder!.yapkod,
      sipNo: null,
      fireTipi: getFireTypeName(),
      fireDetayNo: fireIssue?.siraNo ? parseInt(fireIssue.siraNo) : null,
    })
      .then((response) => {
        ProductionHelper.successProduction(workOrder);
        window.electron.ipcRenderer.send("print-label", response.data.data);

        ToastHelper.success("Üretim Başarılı");

        setSerialNumber(response.data.data.serialNo);

        if (productionType === ProductionType.Numune) {
          setIsMandatory(false);
        }
      })
      .finally(() => {
        store.dispatch(fetchMinMaxValue(workOrder!.isemrino ?? ""));
        store.dispatch(fetchRemaingValue(parseInt(workOrder!.yedek2) ?? 0));
        store.dispatch(clearScale());

        if (ProductionHelper.isMontage(machine?.description2 ?? "")) {
          refetchGrid();
        }
      });
  };

  const isEnabled = useMemo(() => {
    let enabled = false;

    switch (productionType) {
      case ProductionType.Uretim:
        return ScaleHelper.minMaxControll(terazi, minMax);
      case ProductionType.Numune:
        return ScaleHelper.countControl(terazi);
      case ProductionType.YarimKoli:
        return ScaleHelper.countControl(terazi);
      case ProductionType.Fire:
        return terazi.dara > 0.1;
      case ProductionType.RenkGecisi:
        return ScaleHelper.countControl(terazi);
    }

    return enabled;
  }, [productionType, terazi]);

  return (
    <>
      <BottomButton
        onClick={handleClick}
        disabled={!isEnabled || isLoading}
        sx={{
          bgcolor: green[800],
          "&:hover": { bgcolor: green[600] },
          "&:disabled": green[300],
        }}
        icon={<MdGavel size={32} />}
      >
        Üret
      </BottomButton>

      {serialNumber && (
        <BarcodeEntryModal
          open={Boolean(serialNumber)}
          serialNumber={serialNumber ?? ""}
          onClose={() => setSerialNumber(null)}
        />
      )}
    </>
  );
};

export default UretButton;
