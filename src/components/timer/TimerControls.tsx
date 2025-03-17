import React from "react";
import { Stack, IconButton, Tooltip, Zoom, useTheme } from "@mui/material";
import {
  PlayArrow,
  Add,
  Block,
  MenuBook,
  CheckCircle,
} from "@mui/icons-material";

interface TimerControlsProps {
  isActive: boolean;
  hasAddedTime: boolean;
  onStart: () => void;
  onAddTime: () => void;
  onOpenContent: () => void;
  onOpenResult: () => void;
}

/**
 * 타이머 컨트롤 버튼 컴포넌트
 */
const TimerControls: React.FC<TimerControlsProps> = ({
  isActive,
  hasAddedTime,
  onStart,
  onAddTime,
  onOpenContent,
  onOpenResult,
}) => {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      spacing={{ xs: 1.5, sm: 2.5 }}
      justifyContent="center"
      sx={{
        mt: 2,
        perspective: "1000px",
      }}
    >
      <Zoom in={true} style={{ transitionDelay: "100ms" }}>
        {!isActive ? (
          <Tooltip title="시작" arrow placement="top">
            <IconButton
              aria-label="시작"
              color="warning"
              onClick={onStart}
              size="large"
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.warning.light}40 0%, ${theme.palette.warning.main}20 100%)`,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.12)",
                p: { xs: 1.75, sm: 2 },
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                  background: `linear-gradient(135deg, ${theme.palette.warning.light}50 0%, ${theme.palette.warning.main}30 100%)`,
                },
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <PlayArrow
                fontSize="large"
                sx={{
                  filter: "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2))",
                }}
              />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip
            title={hasAddedTime ? "이미 추가되었습니다" : "1분 추가"}
            arrow
            placement="top"
          >
            <span>
              <IconButton
                aria-label={hasAddedTime ? "비활성화됨" : "1분 추가"}
                color="warning"
                onClick={onAddTime}
                disabled={hasAddedTime}
                size="large"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.warning.light}40 0%, ${theme.palette.warning.main}20 100%)`,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.12)",
                  p: { xs: 1.75, sm: 2 },
                  transition: "all 0.2s ease",
                  opacity: hasAddedTime ? 0.7 : 1,
                  "&:hover": {
                    transform: hasAddedTime ? "none" : "translateY(-2px)",
                    boxShadow: hasAddedTime
                      ? "0px 4px 10px rgba(0, 0, 0, 0.12)"
                      : "0px 6px 12px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                {hasAddedTime ? (
                  <Block
                    fontSize="large"
                    sx={{
                      filter: "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2))",
                    }}
                  />
                ) : (
                  <Add
                    fontSize="large"
                    sx={{
                      filter: "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2))",
                    }}
                  />
                )}
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Zoom>

      <Zoom in={true} style={{ transitionDelay: "200ms" }}>
        <Tooltip title="정보 보기" arrow placement="top">
          <IconButton
            aria-label="정보 보기"
            color="info"
            onClick={onOpenContent}
            size="large"
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.info.light}30 0%, ${theme.palette.info.main}10 100%)`,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.12)",
              p: { xs: 1.75, sm: 2 },
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
              },
              "&:active": {
                transform: "translateY(0)",
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <MenuBook
              fontSize="large"
              sx={{
                filter: "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2))",
              }}
            />
          </IconButton>
        </Tooltip>
      </Zoom>

      <Zoom in={true} style={{ transitionDelay: "300ms" }}>
        <Tooltip title="결과 입력" arrow placement="top">
          <IconButton
            aria-label="결과 입력"
            color="success"
            onClick={onOpenResult}
            size="large"
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.success.light}30 0%, ${theme.palette.success.main}10 100%)`,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.12)",
              p: { xs: 1.75, sm: 2 },
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
              },
              "&:active": {
                transform: "translateY(0)",
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <CheckCircle
              fontSize="large"
              sx={{
                filter: "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2))",
              }}
            />
          </IconButton>
        </Tooltip>
      </Zoom>
    </Stack>
  );
};

export default TimerControls;
