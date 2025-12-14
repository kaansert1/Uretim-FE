import { useEmployee } from "@/store/features/employee";
import ProductionHelper from "@/utils/helpers/ProductionHelper";
import { Box } from "@mui/material";
import ArtanEtiketButton from "../buttons/ArtanEtiketButton";
import LabelVerificationButton from "../buttons/LabelVerificationButton";
import MolaButton from "../buttons/MolaButton";
import UretButton from "../buttons/UretButton";
import YardimButtom from "../buttons/YardimButton";
import YardimSayacButton from "../buttons/YardimSayacButton";
import DuruşButton from "../buttons/DurusButton";
const BottomButtonGroups = () => {
  const { machine } = useEmployee();

  return (
    <Box
      sx={{
        height: 100,
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        gap: 3,
      }}
    >
      <MolaButton />
      <DuruşButton />
      <LabelVerificationButton />
      <UretButton />
      {ProductionHelper.isMontage(machine?.description2 ?? "") && (
        <ArtanEtiketButton />
      )}
      <YardimButtom />
      <YardimSayacButton />
    </Box>
  );
};

export default BottomButtonGroups;
