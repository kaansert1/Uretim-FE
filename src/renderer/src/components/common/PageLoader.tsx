import { Backdrop, Box } from "@mui/material";
import Lottie from "lottie-react";
import animationData from "@renderer/assets/lottie/Animation - 1735801214779.json";

interface IProps {
  isLoading: boolean;
}

const PageLoader = ({ isLoading }: IProps) => {
  return (
    <Backdrop
      open={isLoading}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
      }}
    >
      <Box
        sx={{
          width: 300,
          height: 300,
          position: "relative",
        }}
      >
        <Lottie
          animationData={animationData}
          autoplay
          loop
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
    </Backdrop>
  );
};

export default PageLoader;
