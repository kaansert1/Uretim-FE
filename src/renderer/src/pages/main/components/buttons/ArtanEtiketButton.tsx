import BottomButton from "@/components/buttons/BottomButton";
import IncreasedLabelModal from "@/components/modals/label/IncreasedLabelModal";
import ProductionRepository from "@/repositories/ProductionRepository";
import assembly, { useAssembly } from "@/store/features/assembly";
import { useEmployee } from "@/store/features/employee";
import ToastHelper from "@/utils/helpers/ToastHelper";
import { IIncreasedLabelInfo } from "@/utils/interfaces/IIncreasedLabelInfo";
import { IncreasedLabel } from "@/utils/interfaces/enums/IncreasedLabel";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Paper,
  Popover,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { MdLabel } from "react-icons/md";

type ListItem = {
  title: string;
  value: IncreasedLabel;
};

type LabelProps = {
  type: IncreasedLabel | null;
  info: IIncreasedLabelInfo | null;
};

const lists: ListItem[] = [
  {
    title: "Üst Kapak",
    value: IncreasedLabel.Ust,
  },
  {
    title: "Alt Kapak",
    value: IncreasedLabel.Alt,
  },
];

export default function ArtanEtiketButton() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [label, setLabel] = useState<LabelProps>({
    info: null,
    type: null,
  });

  const { workOrder } = useEmployee();
  const { materials } = useAssembly();

  const getMaterialsAmount = useCallback(
    (labelType: IncreasedLabel) => {
      if (labelType === IncreasedLabel.Alt) {
        return materials?.bodyMaterials?.data
          ? materials.bodyMaterials.data.reduce(
              (prev, item) => prev + item.remaining,
              0
            )
          : 0;
      }

      return materials?.topMaterials?.data
        ? materials.topMaterials.data.reduce(
            (prev, item) => prev + item.remaining,
            0
          )
        : 0;
    },
    [materials]
  );

  const handleClick = (labelType: IncreasedLabel) => {
    ProductionRepository.increasedLabelInfo({
      workOrder: workOrder!.isemrino,
      isBody: labelType === IncreasedLabel.Alt,
    }).then((result) => {
      setLabel({ type: labelType, info: result.data });
      setAnchorEl(null);
    });
  };

  return (
    <>
      {label.info && label.type && (
        <IncreasedLabelModal
          open={label.info != null}
          onClose={() => setLabel({ info: null, type: null })}
          labelType={label.type}
          info={label.info}
        />
      )}
      <BottomButton
        icon={<MdLabel />}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
          setAnchorEl(e.currentTarget)
        }
      >
        Artan Etiket
      </BottomButton>
      <Popover
        open={anchorEl !== null}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ width: "250px" }}>
          <List
            component={Paper}
            subheader={
              <ListSubheader component="div">Kapak Tipi</ListSubheader>
            }
            disablePadding
          >
            {lists.map((list) => (
              <ListItem key={list.value} disableGutters>
                <ListItemButton
                  disabled={getMaterialsAmount(list.value) === 0}
                  sx={{ height: 60 }}
                  onClick={() => handleClick(list.value)}
                >
                  <ListItemText>{list.title}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>
    </>
  );
}
