import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Fade,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { StoolAmount } from "./TimerResultHandler";

interface ResultModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (
    isSuccess: boolean,
    stoolAmount: StoolAmount,
    memo: string
  ) => Promise<void>;
  isSaving: boolean;
}

/**
 * 타이머 결과 입력 모달 컴포넌트
 */
const ResultModal: React.FC<ResultModalProps> = ({
  open,
  onClose,
  onSave,
  isSaving,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedResult, setSelectedResult] = useState<"success" | "fail">(
    "success"
  );
  const [stoolAmount, setStoolAmount] = useState<StoolAmount>("");
  const [memo, setMemo] = useState("");

  // 모달이 닫힐 때 초기화
  React.useEffect(() => {
    if (!open) {
      setActiveStep(0);
      resetForm();
    }
  }, [open]);

  const handleChangeResult = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedResult(event.target.value as "success" | "fail");
  };

  const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStoolAmount(event.target.value as StoolAmount);
  };

  const handleChangeMemo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMemo(event.target.value);
  };

  const handleNextStep = () => {
    if (selectedResult === "success") {
      setActiveStep(1); // 성공일 경우 다음 단계로
    } else {
      handleSave(); // 실패일 경우 바로 저장
    }
  };

  const handleBackStep = () => {
    setActiveStep(0);
  };

  const handleSave = async () => {
    try {
      await onSave(selectedResult === "success", stoolAmount, memo);
      resetForm();
    } catch (err) {
      console.error("결과 저장 실패:", err);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setSelectedResult("success");
    setStoolAmount("");
    setMemo("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          배변 결과 입력
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ width: "100%", mt: 2, mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            <Step>
              <StepLabel>결과 선택</StepLabel>
            </Step>
            <Step>
              <StepLabel>세부 정보</StepLabel>
            </Step>
          </Stepper>
        </Box>

        {activeStep === 0 && (
          <Box sx={{ pt: 1 }}>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">결과</FormLabel>
              <RadioGroup
                row
                value={selectedResult}
                onChange={handleChangeResult}
              >
                <FormControlLabel
                  value="success"
                  control={<Radio />}
                  label="성공"
                />
                <FormControlLabel
                  value="fail"
                  control={<Radio />}
                  label="실패"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        )}

        {activeStep === 1 && (
          <Fade in={activeStep === 1}>
            <Box sx={{ pt: 1 }}>
              <FormControl
                component="fieldset"
                sx={{ mb: 2, display: "block" }}
              >
                <FormLabel component="legend">배변량</FormLabel>
                <RadioGroup
                  row
                  value={stoolAmount}
                  onChange={handleChangeAmount}
                >
                  <FormControlLabel
                    value="많음"
                    control={<Radio />}
                    label="많음"
                  />
                  <FormControlLabel
                    value="보통"
                    control={<Radio />}
                    label="보통"
                  />
                  <FormControlLabel
                    value="적음"
                    control={<Radio />}
                    label="적음"
                  />
                  <FormControlLabel
                    value="이상"
                    control={<Radio />}
                    label="이상"
                  />
                </RadioGroup>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <FormLabel>메모 (선택사항)</FormLabel>
                <TextField
                  value={memo}
                  onChange={handleChangeMemo}
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder="추가 내용을 입력하세요 (선택사항)"
                  margin="normal"
                />
              </FormControl>
            </Box>
          </Fade>
        )}
      </DialogContent>

      <DialogActions>
        {activeStep === 0 ? (
          <>
            <Button onClick={onClose} color="inherit" disabled={isSaving}>
              취소
            </Button>
            <Button
              onClick={handleNextStep}
              color="primary"
              variant="contained"
              disabled={isSaving}
            >
              {selectedResult === "success" ? "다음" : "저장"}
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleBackStep}
              color="inherit"
              disabled={isSaving}
            >
              이전
            </Button>
            <Button
              onClick={handleSave}
              color="primary"
              variant="contained"
              disabled={!stoolAmount || isSaving}
              startIcon={
                isSaving ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {isSaving ? "저장 중..." : "저장"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ResultModal;
