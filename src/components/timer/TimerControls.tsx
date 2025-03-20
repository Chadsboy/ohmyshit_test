import React from "react";
import { Stack, IconButton, Tooltip, Zoom, useTheme } from "@mui/material";
import {
  PlayArrow,
  Add,
  MenuBook,
  CheckCircle,
  Block,
} from "@mui/icons-material";

interface TimerControlsProps {
  isActive: boolean;
  hasAddedTime?: boolean;
  onStart: () => void;
  onAddTime: () => void;
  onOpenContent?: () => void;
  onOpenResult?: () => void;
}

/**
 * 타이머 컨트롤 컴포넌트
 * 타이머 시작, 시간 추가, 정보 보기, 결과 입력 기능을 제공합니다.
 */
const TimerControls: React.FC<TimerControlsProps> = ({
  isActive,
  hasAddedTime = false,
  onStart,
  onAddTime,
  onOpenContent,
  onOpenResult,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // 그림자 스타일을 테마에 따라 결정
  const shadowColor = isDarkMode ? "rgba(255,255,255," : "rgba(0,0,0,";
  const buttonBaseShadow = isDarkMode
    ? "0 4px 10px rgba(255,255,255,0.1)"
    : "0 4px 10px rgba(0,0,0,0.15)";
  const buttonHoverShadow = isDarkMode
    ? "0 8px 15px rgba(255,255,255,0.15)"
    : "0 8px 15px rgba(0,0,0,0.2)";
  const buttonActiveShadow = isDarkMode
    ? "0 3px 5px rgba(255,255,255,0.1)"
    : "0 3px 5px rgba(0,0,0,0.1)";

  // 버튼별 그림자 스타일
  const getButtonShadow = (
    color: string,
    opacity1: number,
    opacity2: number
  ) => {
    return {
      base: isDarkMode
        ? `0 4px 12px rgba(${color},${opacity1 + 0.1})`
        : `0 4px 12px rgba(${color},${opacity1})`,
      hover: isDarkMode
        ? `0 6px 16px rgba(${color},${opacity2 + 0.1})`
        : `0 6px 16px rgba(${color},${opacity2})`,
    };
  };

  // 각 버튼의 색상 정의
  const primaryColor = isDarkMode ? "144, 238, 144" : "76, 175, 80"; // 연두색/초록색
  const secondaryColor = isDarkMode ? "216, 191, 216" : "156, 39, 176"; // 라벤더/보라색
  const infoColor = isDarkMode ? "173, 216, 230" : "41, 182, 246"; // 연한파랑/파랑
  const successColor = isDarkMode ? "144, 238, 144" : "76, 175, 80"; // 연두색/초록색

  // 각 버튼별 그림자
  const primaryShadow = getButtonShadow(primaryColor, 0.3, 0.4);
  const secondaryShadow = getButtonShadow(secondaryColor, 0.3, 0.4);
  const infoShadow = getButtonShadow(infoColor, 0.3, 0.4);
  const successShadow = getButtonShadow(successColor, 0.3, 0.4);

  return (
    <Stack
      direction="row"
      spacing={1.5}
      justifyContent="center"
      sx={{
        mt: 1,
        mb: 2,
        "& .MuiIconButton-root": {
          transition: "all 0.3s ease-in-out",
          boxShadow: buttonBaseShadow,
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: buttonHoverShadow,
          },
          "&:active": {
            transform: "translateY(-1px)",
            boxShadow: buttonActiveShadow,
          },
        },
      }}
    >
      {/* 시작 또는 시간 추가 버튼 */}
      {!isActive ? (
        <Tooltip title="시작" placement="top" TransitionComponent={Zoom} arrow>
          <IconButton
            onClick={onStart}
            color="primary"
            size="large"
            sx={{
              backgroundColor: isDarkMode
                ? `rgba(${primaryColor}, 0.15)`
                : `rgba(${primaryColor}, 0.1)`,
              boxShadow: primaryShadow.base,
              "&:hover": {
                boxShadow: primaryShadow.hover,
                backgroundColor: isDarkMode
                  ? `rgba(${primaryColor}, 0.25)`
                  : `rgba(${primaryColor}, 0.15)`,
              },
            }}
          >
            <PlayArrow />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip
          title={hasAddedTime ? "이미 추가되었습니다" : "3분 추가"}
          placement="top"
          TransitionComponent={Zoom}
          arrow
        >
          <span>
            <IconButton
              onClick={onAddTime}
              color="secondary"
              size="large"
              disabled={hasAddedTime}
              sx={{
                backgroundColor: hasAddedTime
                  ? isDarkMode
                    ? "rgba(50, 50, 50, 0.2)"
                    : "rgba(0, 0, 0, 0.05)"
                  : isDarkMode
                  ? `rgba(${secondaryColor}, 0.15)`
                  : `rgba(${secondaryColor}, 0.05)`,
                boxShadow: hasAddedTime
                  ? isDarkMode
                    ? "0 4px 8px rgba(255, 255, 255, 0.05)"
                    : "0 4px 8px rgba(0, 0, 0, 0.1)"
                  : secondaryShadow.base,
                "&:hover": {
                  backgroundColor: hasAddedTime
                    ? isDarkMode
                      ? "rgba(50, 50, 50, 0.2)"
                      : "rgba(0, 0, 0, 0.05)"
                    : isDarkMode
                    ? `rgba(${secondaryColor}, 0.25)`
                    : `rgba(${secondaryColor}, 0.1)`,
                  boxShadow: hasAddedTime
                    ? isDarkMode
                      ? "0 4px 8px rgba(255, 255, 255, 0.05)"
                      : "0 4px 8px rgba(0, 0, 0, 0.1)"
                    : secondaryShadow.hover,
                },
              }}
            >
              {hasAddedTime ? <Block /> : <Add />}
            </IconButton>
          </span>
        </Tooltip>
      )}

      {/* 정보 버튼 */}
      {onOpenContent && (
        <Tooltip
          title="정보 보기"
          placement="top"
          TransitionComponent={Zoom}
          arrow
        >
          <IconButton
            onClick={onOpenContent}
            color="info"
            size="large"
            sx={{
              backgroundColor: isDarkMode
                ? `rgba(${infoColor}, 0.15)`
                : `rgba(${infoColor}, 0.05)`,
              boxShadow: infoShadow.base,
              "&:hover": {
                backgroundColor: isDarkMode
                  ? `rgba(${infoColor}, 0.25)`
                  : `rgba(${infoColor}, 0.1)`,
                boxShadow: infoShadow.hover,
              },
            }}
          >
            <MenuBook />
          </IconButton>
        </Tooltip>
      )}

      {/* 결과 입력 버튼 */}
      {onOpenResult && (
        <Tooltip
          title="결과 입력"
          placement="top"
          TransitionComponent={Zoom}
          arrow
        >
          <IconButton
            onClick={onOpenResult}
            color="success"
            size="large"
            sx={{
              backgroundColor: isDarkMode
                ? `rgba(${successColor}, 0.15)`
                : `rgba(${successColor}, 0.05)`,
              boxShadow: successShadow.base,
              "&:hover": {
                backgroundColor: isDarkMode
                  ? `rgba(${successColor}, 0.25)`
                  : `rgba(${successColor}, 0.1)`,
                boxShadow: successShadow.hover,
              },
            }}
          >
            <CheckCircle />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
};

export default TimerControls;
