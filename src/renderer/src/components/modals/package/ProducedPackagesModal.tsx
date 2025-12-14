import PageDialog from "@/components/common/PageDialog";
import ProductionRepository from "@/repositories/ProductionRepository";
import { useEmployee } from "@/store/features/employee";
import { useLoader } from "@/store/features/loader";
import producedItemColumns from "@/utils/columns/producedItemColumn";
import { IProducedItem } from "@/utils/interfaces/ProducedItem";
import { IProducedMaterial } from "@/utils/interfaces/ProducedMaterial";
import { Box, Divider, Button } from "@mui/material";
import { DataGrid, GridRowParams } from "@mui/x-data-grid";
import producedMaterialColumns from "@/utils/columns/producedMaterialColumn";
import { useEffect, useState } from "react";
import { AiFillPrinter } from "react-icons/ai";
import BarcodeEntryModal from "../entry/BarcodeEntryModal";

interface IProps {
  onClose: () => void;
  open: boolean;
}

const ProducedPackagesModal = ({ onClose, open }: IProps) => {
  const [serialNumber, setSerialNumber] = useState<string | null>(null);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [producedItems, setProducedItems] = useState<IProducedItem[]>([]);
  const [producedMaterials, setProducedMaterials] = useState<
    IProducedMaterial[]
  >([]);
  const [selected, setSelected] = useState<IProducedItem | null>(null);

  const { workOrder, machine } = useEmployee();
  const { isLoading } = useLoader();

  const getMaterials = async (id: number) => {
    const { data: results } = (
      await ProductionRepository.getProducedMaterials(id)
    ).data;

    setProducedMaterials(results);
  };

  const getProducedItems = async () => {
    const results = (
      await ProductionRepository.getProducedItems({
        workOrder: workOrder?.isemrino ?? "",
      })
    ).data;

    setTotalPage(results.totalRecords);
    setProducedItems(results.data);
  };

  const handleRowClick = (params: GridRowParams<IProducedItem>) => {
    getMaterials(params.row.id);
    setSelected(params.row);
  };

  const handlePrintClick = async () => {
    if (!selected) return;

    ProductionRepository.getProducedLabel(
      selected.seriNo,
      selected.uretTip,
      machine?.description2 ?? ""
    ).then(({ data: result }) => {
      window.electron.ipcRenderer.send("print-label", result.data);

      setSerialNumber(result.data.serialNo);
    });
  };

  const handleCloseBarcodeModal = () => {
    setSelected(null);
    setSerialNumber(null);
    setProducedMaterials([]);
    getProducedItems();
    onClose();
  };

  useEffect(() => {
    if (open) {
      getProducedItems();
    } else {
      setSelected(null);
      setProducedMaterials([]);
    }
  }, [open]);

  return (
    <PageDialog onClose={onClose} title="Üretilen Koliler" open={open}>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Button
          onClick={handlePrintClick}
          disabled={!Boolean(selected)}
          sx={{ mb: 2, ml: "auto" }}
          startIcon={<AiFillPrinter />}
          variant="contained"
          size="large"
        >
          Yazdır
        </Button>
      </Box>
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <DataGrid
          pagination
          columns={producedItemColumns}
          rows={producedItems}
          getRowId={(row) => row.id}
          paginationMode="server"
          loading={isLoading}
          rowCount={totalPage}
          onRowClick={handleRowClick}
          hideFooterPagination
        />
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <DataGrid
          loading={isLoading}
          getRowId={(row) => row?.id}
          rows={producedMaterials}
          columns={producedMaterialColumns}
        />
      </Box>

      {open && (
        <BarcodeEntryModal
          open={Boolean(serialNumber)}
          onClose={handleCloseBarcodeModal}
          serialNumber={serialNumber ?? ""}
        />
      )}
    </PageDialog>
  );
};

export default ProducedPackagesModal;
