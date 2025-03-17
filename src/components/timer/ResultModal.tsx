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
  const [selectedResult, setSelectedResult] = useState<"success" | "fail">(
    "success"
  );
  const [stoolAmount, setStoolAmount] = useState<StoolAmount>("");
  const [memo, setMemo] = useState("");

  const handleChangeResult = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedResult(event.target.value as "success" | "fail");
  };

  const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStoolAmount(event.target.value as StoolAmount);
  };

  const handleChangeMemo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMemo(event.target.value);
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
              <FormControlLabel value="fail" control={<Radio />} label="실패" />
            </RadioGroup>
          </FormControl>

          {selectedResult === "success" && (
            <>
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
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={isSaving}>
          취소
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={(selectedResult === "success" && !stoolAmount) || isSaving}
          startIcon={
            isSaving ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isSaving ? "저장 중..." : "저장"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResultModal;
