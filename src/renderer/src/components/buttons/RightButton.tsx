import { useNumuneContext } from "@/contexts/NumuneContext";
import store from "@/store";
import { useEmployee } from "@/store/features/employee";
import {
  clearScale,
  fetchMinMaxValue,
  setAuth,
  setProductionType,
  useProduction,
} from "@/store/features/production";
import ProductionHelper from "@/utils/helpers/ProductionHelper";
import { ProductionType } from "@/utils/interfaces/enums/ProductionType";
import { ButtonProps, Button } from "@mui/material";
import React, { useEffect } from "react";

interface IProps extends ButtonProps {
  children: React.ReactNode;
  value: ProductionType;
}

const RightButton = ({ children, sx, value, onClick, ...props }: IProps) => {
  const { productionType } = useProduction();
  const { workOrder } = useEmployee();

  const { isMandatory } = useNumuneContext();

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (value !== ProductionType.Fire) {
      store.dispatch(setProductionType({ data: value }));
      store.dispatch(fetchMinMaxValue(workOrder!.isemrino));
    }

    store.dispatch(setAuth(false));
    onClick && onClick(event);
  };

  useEffect(() => {
    if (ProductionHelper.isRenkGecisi(workOrder?.yapkod ?? "")) {
      // (_, datax: { data: ProductionType; fireType: string }) => {
      //   datax.data = ProductionType.RenkGecisi;
      //   datax.fireType = "-1";
      //   store.dispatch(setProductionType(datax));
      // }
      store.dispatch(setProductionType({ data: ProductionType.RenkGecisi }));
      //store.dispatch(setProductionType(ProductionType.RenkGecisi))
    }
  }, []);

  useEffect(() => {
    store.dispatch(clearScale());
  }, [productionType]);

  return (
    <Button
      {...props}
      onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
        handleClick(event)
      }
      sx={{ flex: 1, fontWeight: "600", ...sx }}
      size="large"
      variant="contained"
      color={value === productionType ? "info" : "inherit"}
    >
      {children}
    </Button>
  );
};

export default RightButton;
