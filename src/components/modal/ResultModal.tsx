import React, { useState } from "react";
import {
  Modal,
  Paper,
  Typography,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  Zoom,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Divider,
  CircularProgress,
} from "@mui/material";
import { CheckCircle, Cancel, SaveAlt } from "@mui/icons-material";

// 배변량 타입
type StoolAmount = "많음" | "보통" | "적음" | "이상" | "";

interface ResultModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (stoolAmount: StoolAmount, memo: string) => void;
  onFail: () => void;
  isSaving?: boolean; // 저장 중 상태 추가
}

const ResultModal: React.FC<ResultModalProps> = ({
  open,
  onClose,
  onSuccess,
  onFail,
  isSaving = false, // 기본값은 false
}) => {
  const [showSuccessDetails, setShowSuccessDetails] = useState<boolean>(false);
  const [stoolAmount, setStoolAmount] = useState<StoolAmount>("");
  const [memo, setMemo] = useState<string>("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 성공/실패 처리
  const handleResult = (success: boolean) => {
    if (success) {
      // 성공 시 상세 정보 입력 폼 표시
      setShowSuccessDetails(true);
    } else {
      // 실패 시 콜백 호출
      onFail();
    }
  };

  // 상세 정보 저장
  const handleSaveDetails = () => {
    // 성공 콜백 호출
    onSuccess(stoolAmount, memo);

    // 폼 초기화
    resetForm();
  };

  // 폼 초기화 및 모달 닫기
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // 폼 상태 초기화
  const resetForm = () => {
    setShowSuccessDetails(false);
    setStoolAmount("");
    setMemo("");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Zoom in={open}>
        <Paper
          sx={{
            position: "relative",
            width: isMobile ? "90%" : 400,
            p: 4,
            borderRadius: 3,
            outline: "none",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0px 10px 40px rgba(0, 0, 0, 0.4)"
                : "0px 10px 40px rgba(0, 0, 0, 0.2)",
            background:
              theme.palette.mode === "dark"
                ? `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`
                : `linear-gradient(145deg, #ffffff, #f8f8f8)`,
            maxHeight: "90vh",
            overflowY: "auto",
            m: "auto",
            maxWidth: "90%",
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            textAlign="center"
            sx={{
              fontWeight: "bold",
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
            결과 입력 페이지 입니다
          </Typography>

          {!showSuccessDetails ? (
            // 초기 선택 화면: 성공 또는 실패
            <>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, textAlign: "center", opacity: 0.9 }}
              >
                타이머 작업을 완료했나요?
              </Typography>

              <Stack
                direction="row"
                spacing={3}
                justifyContent="center"
                sx={{ mt: 2 }}
              >
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={() => handleResult(true)}
                  size="large"
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: "0px 4px 12px rgba(76, 175, 80, 0.4)",
                    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: "0px 6px 15px rgba(76, 175, 80, 0.5)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  성공
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => handleResult(false)}
                  size="large"
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: "0px 4px 12px rgba(211, 47, 47, 0.4)",
                    background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: "0px 6px 15px rgba(211, 47, 47, 0.5)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  실패
                </Button>
              </Stack>
            </>
          ) : (
            // 성공 시 추가 정보 입력 폼
            <>
              <Divider sx={{ mb: 3 }} />

              <FormControl component="fieldset" sx={{ width: "100%", mb: 3 }}>
                <FormLabel
                  component="legend"
                  sx={{
                    mb: 1,
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                  }}
                >
                  배변량
                </FormLabel>
                <RadioGroup
                  row
                  value={stoolAmount}
                  onChange={(e) =>
                    setStoolAmount(e.target.value as StoolAmount)
                  }
                  sx={{ justifyContent: "space-between" }}
                >
                  <FormControlLabel
                    value="많음"
                    control={<Radio color="success" />}
                    label="많음"
                  />
                  <FormControlLabel
                    value="보통"
                    control={<Radio color="success" />}
                    label="보통"
                  />
                  <FormControlLabel
                    value="적음"
                    control={<Radio color="success" />}
                    label="적음"
                  />
                  <FormControlLabel
                    value="이상"
                    control={<Radio color="error" />}
                    label="이상"
                  />
                </RadioGroup>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="메모 (선택사항)"
                placeholder="특이사항이 있으면 입력해주세요"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                variant="outlined"
                sx={{ mb: 3 }}
              />

              <Button
                variant="contained"
                color="primary"
                startIcon={
                  isSaving ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SaveAlt />
                  )
                }
                onClick={handleSaveDetails}
                size="large"
                fullWidth
                disabled={!stoolAmount || isSaving} // 저장 중일 때도 비활성화
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: "0px 4px 12px rgba(25, 118, 210, 0.4)",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: "0px 6px 15px rgba(25, 118, 210, 0.5)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {isSaving ? "저장 중..." : "저장"}
              </Button>
            </>
          )}
        </Paper>
      </Zoom>
    </Modal>
  );
};

export default ResultModal;
