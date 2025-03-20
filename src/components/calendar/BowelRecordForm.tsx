import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { BowelRecordService } from "../../services/bowelRecordService";

const StyledForm = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  padding: theme.spacing(1),
}));

interface BowelRecordFormProps {
  open: boolean;
  onClose: () => void;
  selectedDate: string; // YYYY-MM-DD 형식
  onSuccess: () => void;
}

/**
 * 새로운 배변 기록 입력 폼 컴포넌트
 * 기존의 타임존 변환 문제를 피하기 위해 완전히 새로 구현
 */
const BowelRecordForm: React.FC<BowelRecordFormProps> = ({
  open,
  onClose,
  selectedDate,
  onSuccess,
}) => {
  // 폼 상태 관리
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState(5);
  const [isSuccess, setIsSuccess] = useState(true);
  const [amount, setAmount] = useState<string>("보통");
  const [memo, setMemo] = useState("");

  // 로딩 및 에러 상태
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateWarning, setDateWarning] = useState<string | null>(null);

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setDateWarning(null);

    try {
      console.log("[BowelRecordForm] 선택한 날짜:", selectedDate);
      console.log("[BowelRecordForm] 폼 제출 데이터:", {
        date: selectedDate,
        time,
        duration,
        isSuccess,
        amount: isSuccess ? amount : null,
        memo: memo || null,
      });

      // 새 배변 기록 서비스 사용
      const response = await BowelRecordService.createRecord(
        selectedDate,
        time,
        duration,
        isSuccess,
        isSuccess ? amount : null,
        memo || null
      );

      if (response.error) {
        throw response.error;
      }

      console.log("[BowelRecordForm] 저장 성공:", response.data);
      console.log(
        "[BowelRecordForm] 저장된 record_date:",
        response.data?.record_date
      );

      // 날짜 불일치 경고 확인
      if (response.data?.date_warning) {
        setDateWarning(response.data.date_warning);
        // 5초 후 자동으로 폼 닫기
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 5000);
      } else {
        // 날짜 불일치가 없으면 바로 닫기
        onSuccess();
        handleClose();
      }
    } catch (err) {
      console.error("[BowelRecordForm] 저장 실패:", err);
      setError((err as Error).message || "저장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 폼 초기화 및 닫기
  const handleClose = () => {
    setTime("09:00");
    setDuration(5);
    setIsSuccess(true);
    setAmount("보통");
    setMemo("");
    setError(null);
    setDateWarning(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          {selectedDate} 배변 기록 추가
        </Typography>
      </DialogTitle>

      <DialogContent>
        <StyledForm onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

          {dateWarning && (
            <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
              {dateWarning}
            </Alert>
          )}

          <TextField
            label="시간"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />

          <TextField
            label="소요 시간 (분)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 5)}
            InputProps={{ inputProps: { min: 1, max: 60 } }}
            fullWidth
            required
          />

          <FormControl component="fieldset">
            <FormLabel component="legend">성공 여부</FormLabel>
            <RadioGroup
              row
              value={isSuccess ? "success" : "failure"}
              onChange={(e) => setIsSuccess(e.target.value === "success")}
            >
              <FormControlLabel
                value="success"
                control={<Radio />}
                label="성공"
              />
              <FormControlLabel
                value="failure"
                control={<Radio />}
                label="실패"
              />
            </RadioGroup>
          </FormControl>

          {isSuccess && (
            <TextField
              select
              label="배변량"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              required={isSuccess}
            >
              <MenuItem value="많음">많음</MenuItem>
              <MenuItem value="보통">보통</MenuItem>
              <MenuItem value="적음">적음</MenuItem>
              <MenuItem value="이상">이상</MenuItem>
            </TextField>
          )}

          <TextField
            label="메모"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </StyledForm>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} color="inherit">
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={isLoading}
          startIcon={
            isLoading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BowelRecordForm;
