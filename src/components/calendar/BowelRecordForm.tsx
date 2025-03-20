import React, { useState, useEffect, useRef } from "react";
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
import SaveButton from "../common/SaveButton";
import CancelButton from "../common/CancelButton";

// 저장 버튼 상태를 추적하는 전역 변수 (컴포넌트 외부)
let isSaving = false;

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
  isLoading?: boolean; // 외부에서 제어하는 로딩 상태
  onLoadingChange?: (loading: boolean) => void; // 로딩 상태 변경 콜백
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
  isLoading: externalLoading,
  onLoadingChange,
}) => {
  console.log(
    "[BowelRecordForm] 컴포넌트 렌더링. open:",
    open,
    "externalLoading:",
    externalLoading
  );

  // useRef를 사용하여 제출 상태 추적
  const isSubmitting = useRef(false);

  // 로딩 및 에러 상태
  const [internalLoading, setInternalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateWarning, setDateWarning] = useState<string | null>(null);

  // 실제 사용할 로딩 상태 결정
  const isLoading =
    externalLoading !== undefined ? externalLoading : internalLoading;

  // 폼 상태 관리
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState(5);
  const [isSuccess, setIsSuccess] = useState(true);
  const [amount, setAmount] = useState<string>("보통");
  const [memo, setMemo] = useState("");

  // 내부 로딩 상태가 변경될 때 외부로 알림
  useEffect(() => {
    if (onLoadingChange && internalLoading !== externalLoading) {
      onLoadingChange(internalLoading);
    }
  }, [internalLoading, externalLoading, onLoadingChange]);

  // 폼 초기화 함수를 useEffect보다 먼저 정의
  const resetForm = () => {
    console.log("[BowelRecordForm] resetForm 호출 - 모든 상태 초기화");
    setTime("09:00");
    setDuration(5);
    setIsSuccess(true);
    setAmount("보통");
    setMemo("");
    setError(null);
    setDateWarning(null);
    setInternalLoading(false);
    isSubmitting.current = false; // useRef도 초기화
    isSaving = false; // 전역 변수도 초기화
    if (onLoadingChange) onLoadingChange(false);
  };

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    console.log("[BowelRecordForm] 컴포넌트 마운트 - 초기화");

    // 초기 마운트 시 상태 초기화
    resetForm();

    // 전역 변수 초기화
    isSaving = false;

    // StrictMode에서의 이중 렌더링 대응
    const timer = setTimeout(() => {
      console.log("[BowelRecordForm] 지연 초기화 실행");
      isSubmitting.current = false;
      isSaving = false; // 전역 변수도 초기화
      setInternalLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    }, 100);

    // 클린업 함수
    return () => {
      console.log("[BowelRecordForm] 컴포넌트 언마운트 - 클린업");
      clearTimeout(timer);
      isSubmitting.current = false;
      isSaving = false; // 전역 변수도 초기화
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 컴포넌트가 열릴 때마다 폼 초기화
  useEffect(() => {
    console.log("[BowelRecordForm] open 상태 변경:", open);
    if (open) {
      console.log("[BowelRecordForm] 모달 열림 - 폼 초기화");

      // 모달이 열릴 때 강제 초기화
      isSaving = false;

      resetForm();
    } else {
      // 모달이 닫힐 때도 상태 초기화
      isSaving = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 이미 제출 중이면 무시
    if (isSaving) {
      console.log("[BowelRecordForm] 이미 제출 중입니다. 중복 제출 방지");
      return;
    }

    try {
      // 제출 상태 및 로딩 상태 설정
      isSaving = true;
      isSubmitting.current = true;
      setInternalLoading(true);
      if (onLoadingChange) onLoadingChange(true);

      // 상태 초기화
      setError(null);
      setDateWarning(null);

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

      // 성공 콜백 호출
      onSuccess();

      // 날짜 불일치 경고 확인
      if (response.data?.date_warning) {
        setDateWarning(response.data.date_warning);
        // 경고가 있으면 폼을 닫지 않고 경고 표시
      } else {
        // 날짜 불일치가 없으면 폼 닫기
        handleClose();
      }

      // 폼 상태 초기화 (성공 시에도 초기화)
      resetForm();
    } catch (err) {
      console.error("[BowelRecordForm] 저장 실패:", err);
      setError((err as Error).message || "저장 중 오류가 발생했습니다.");
    } finally {
      // 항상 로딩 상태 및 제출 상태 초기화 - 전역 변수 포함
      console.log("[BowelRecordForm] 저장 작업 완료, 모든 상태 초기화");
      isSaving = false; // 전역 변수 초기화
      isSubmitting.current = false;
      setInternalLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    }
  };

  // 폼 닫기 핸들러
  const handleClose = () => {
    console.log("[BowelRecordForm] 폼 닫기");
    resetForm(); // 폼 데이터 초기화
    isSubmitting.current = false; // 확실히 초기화
    isSaving = false; // 전역 변수도 확실히 초기화
    setInternalLoading(false); // 로딩 상태 확실히 초기화
    if (onLoadingChange) onLoadingChange(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableScrollLock={false}
      sx={{ overflow: "hidden" }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          {selectedDate} 배변 기록 추가
        </Typography>
      </DialogTitle>

      <DialogContent>
        <StyledForm
          id="bowel-record-form"
          onSubmit={handleSubmit}
          onReset={() => resetForm()}
        >
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
        <CancelButton onCancel={handleClose} />
        <SaveButton
          onClick={(e) => {
            e.preventDefault();

            // 이미 저장 중이면 중복 클릭 방지
            if (isSaving) {
              console.log("[BowelRecordForm] 버튼 클릭: 이미 저장 중");
              return;
            }

            // 저장 중 상태로 설정 (전역 변수)
            isSaving = true;

            // 비동기 실행을 위한 타이머 (0ms 지연)
            setTimeout(() => {
              console.log("[BowelRecordForm] 버튼 클릭: 제출 함수 실행");
              handleSubmit(e);
            }, 0);
          }}
          isLoading={isSaving}
        />
      </DialogActions>
    </Dialog>
  );
};

export default BowelRecordForm;
