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

  return (
    <Stack
      direction="row"
      spacing={1.5}
      justifyContent="center"
      sx={{
        mt: 1,
        mb: 2,
        "& .MuiIconButton-root": {
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
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
              backgroundColor: "rgba(76, 175, 80, 0.1)",
              "&:hover": {
                backgroundColor: "rgba(76, 175, 80, 0.2)",
              },
            }}
          >
            <PlayArrow />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip
          title={hasAddedTime ? "이미 추가되었습니다" : "1분 추가"}
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
                  ? "rgba(0, 0, 0, 0.05)"
                  : "rgba(156, 39, 176, 0.05)",
                "&:hover": {
                  backgroundColor: hasAddedTime
                    ? "rgba(0, 0, 0, 0.05)"
                    : "rgba(156, 39, 176, 0.1)",
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
              backgroundColor: "rgba(41, 182, 246, 0.05)",
              "&:hover": {
                backgroundColor: "rgba(41, 182, 246, 0.1)",
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
              backgroundColor: "rgba(76, 175, 80, 0.05)",
              "&:hover": {
                backgroundColor: "rgba(76, 175, 80, 0.1)",
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
