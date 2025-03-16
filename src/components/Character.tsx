import { Box, useTheme, useMediaQuery } from "@mui/material";
import { keyframes } from "@mui/system";
import { CharacterProps } from "../types/index";

// 애니메이션 정의
const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const wave = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
  100% { transform: rotate(0deg); }
`;

export const Character = ({
  image,
  animation = "none",
  size = "medium",
}: CharacterProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isVeryNarrow = useMediaQuery("(max-width:300px)");

  // 크기 설정 (모바일 크기 증가)
  const sizeMap = {
    small: isVeryNarrow ? "160px" : isMobile ? "180px" : "250px",
    medium: isVeryNarrow ? "180px" : isMobile ? "220px" : "350px",
    large: isVeryNarrow ? "200px" : isMobile ? "240px" : "450px",
  };

  // 애니메이션 설정
  const animationStyle = {
    bounce: {
      animation: `${bounce} 2s ease-in-out infinite`,
    },
    wave: {
      animation: `${wave} 2s ease-in-out infinite`,
    },
    none: {},
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        py: isMobile ? 1 : 2,
        overflow: "hidden",
      }}
    >
      <img
        src={image}
        alt="Character"
        style={{
          width: "auto",
          height: sizeMap[size],
          maxWidth: "100%",
          objectFit: "contain",
          ...animationStyle[animation],
        }}
      />
    </Box>
  );
};
