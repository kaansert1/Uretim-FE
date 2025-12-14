import BottomButton from "@/components/buttons/BottomButton";
import ProducedPackagesModal from "@/components/modals/package/ProducedPackagesModal";
import { grey } from "@mui/material/colors";
import { useState } from "react";
import { MdOutbox } from "react-icons/md";

const UretilenKolilerButton = () => {
  const [dialog, setDialog] = useState<boolean>(false);

  return (
    <>
      <ProducedPackagesModal open={dialog} onClose={() => setDialog(false)} />
      <BottomButton
        disabled={true}
        onClick={() => setDialog(true)}
        sx={{ bgcolor: grey[800], "&:hover": { bgcolor: grey[600] } }}
        icon={<MdOutbox size={32} />}
      >
        Üretilen Koliler
      </BottomButton>
    </>
  );
};

export default UretilenKolilerButton;
