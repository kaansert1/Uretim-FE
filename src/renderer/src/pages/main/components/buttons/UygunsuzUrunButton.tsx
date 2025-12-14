import BottomButton from "@/components/buttons/BottomButton";
import { MdSmsFailed } from "react-icons/md";
import { red } from "@mui/material/colors";
import { useState } from "react";
import IncorrectProductModal from "@/components/modals/incorrect/IncorrectProductModal";

const UygunsuzUrunButton = () => {
  const [dialog, setDialog] = useState<boolean>(false);

  return (
    <>
      {dialog && (
        <IncorrectProductModal open={dialog} onClose={() => setDialog(false)} />
      )}
      <BottomButton
        disabled
        onClick={() => setDialog(true)}
        sx={{
          bgcolor: red[800],
          "&:hover": {
            bgcolor: red[600],
          },
        }}
        icon={<MdSmsFailed size={32} />}
      >
        Uygunsuz Ürün
      </BottomButton>
    </>
  );
};

export default UygunsuzUrunButton;
