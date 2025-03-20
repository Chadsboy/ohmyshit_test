import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { CalendarEvent } from "../types";
import { getCurrentKoreanTime } from "../utils/dateHelpers";
import SaveButton from "./common/SaveButton";
import CancelButton from "./common/CancelButton";
import { useLoading } from "../contexts/LoadingContext";

// dayjs에 플러그인 추가
dayjs.extend(utc);
dayjs.extend(timezone);

// 한국 시간대 설정
dayjs.tz.setDefault("Asia/Seoul");

// EventFormProps 인터페이스를 직접 정의
interface EventFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (event: Omit<CalendarEvent, "id" | "created_at">) => Promise<void>;
  initialData?: CalendarEvent;
  title?: string;
  selectedDate?: Dayjs | null; // 선택된 날짜 prop 추가
}

/**
 * 이벤트 생성/수정 폼 컴포넌트
 * 기존 코드에서 배변 기록에 맞게 수정되었습니다.
 */
const EventForm: React.FC<EventFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  title = "새 일정 등록",
  selectedDate,
}) => {
  const [date, setDate] = useState<Dayjs | null>(
    initialData?.date ? dayjs(initialData.date) : selectedDate || dayjs()
  );
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(true);
  const [amount, setAmount] = useState<string>("보통");
  const [time, setTime] = useState<string>(dayjs().format("HH:mm"));
  const [duration, setDuration] = useState<string>("5"); // 소요 시간 (분)
  const [memo, setMemo] = useState<string>("");

  // 로컬 상태 대신 LoadingContext 사용
  const { isSaving: isSubmittingGlobal, setSaving: setSubmittingGlobal } =
    useLoading();

  // 초기 데이터가 변경될 때 폼 필드 업데이트
  useEffect(() => {
    if (initialData) {
      setDate(dayjs(initialData.date));
      setDescription(initialData.description);

      // initialData에서 시간 파싱
      const timeMatch = initialData.title.match(/\((\d{2}:\d{2})\)/);
      if (timeMatch && timeMatch[1]) {
        setTime(timeMatch[1]);
      } else {
        // 현재 시간으로 기본값 설정
        setTime(getCurrentKoreanTime("HH:mm"));
      }

      // initialData에서 소요 시간 파싱
      const durationMatch = initialData.description.match(/소요 시간: (\d+)분/);
      if (durationMatch && durationMatch[1]) {
        setDuration(durationMatch[1]);
      }

      // initialData에서 배변 성공 여부 파싱
      if (initialData.title.includes("성공")) {
        setSuccess(true);

        // 배변량 파싱 (예: "배변 성공 (12:34) - 많음")
        const match = initialData.title.match(/- (많음|보통|적음|이상)/);
        if (match && match[1]) {
          setAmount(match[1]);
        } else {
          setAmount("보통");
        }
      } else {
        setSuccess(false);
        setAmount("보통");
      }

      // 메모 설정
      const memoMatch = initialData.description.match(/메모: (.+)/);
      if (memoMatch && memoMatch[1]) {
        setMemo(memoMatch[1]);
      }
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmittingGlobal(true);

    if (!date) {
      setError("날짜를 선택해주세요.");
      setSubmittingGlobal(false);
      return;
    }

    const formattedDate = date.format("YYYY-MM-DD");

    // 사용자가 선택한 시간을 그대로 사용
    const timeString = time;

    // 현재 시간 기록 (디버깅 용도)
    console.log("입력 시간:", timeString);
    console.log("현재 시간:", dayjs().format("HH:mm"));
    console.log("현재 시간 (UTC):", dayjs().utc().format("HH:mm"));
    console.log("현재 시간 (한국):", dayjs().tz("Asia/Seoul").format("HH:mm"));
    console.log("선택한 날짜:", formattedDate);
    console.log("타임존:", dayjs.tz.guess());

    // 제목 생성 (폼에서 입력한 것이 아닌 상태에 따라 생성)
    const generatedTitle = success
      ? `배변 성공 (${timeString}) - ${amount}`
      : `배변 시도 (${timeString})`;

    // 설명에 배변 관련 정보 자동 추가
    let fullDescription = description;
    if (!fullDescription.includes("소요 시간")) {
      fullDescription = `소요 시간: ${duration}분\n${fullDescription}`;
    } else {
      // 기존 소요 시간 정보 업데이트
      fullDescription = fullDescription.replace(
        /소요 시간: \d+분/,
        `소요 시간: ${duration}분`
      );
    }

    if (memo.trim()) {
      fullDescription += `\n메모: ${memo}`;
    }

    try {
      await onSubmit({
        title: generatedTitle,
        description: fullDescription,
        date: formattedDate,
      });
      onClose();
    } catch (err) {
      setError((err as Error).message || "저장 중 오류가 발생했습니다.");
    } finally {
      // 전역 저장 상태 초기화
      setTimeout(() => setSubmittingGlobal(false), 500);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <DialogContentText sx={{ mb: 3 }}>
            배변 기록 정보를 입력해주세요.
          </DialogContentText>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <DatePicker
                label="날짜"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                sx={{ width: "100%" }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="시간"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                sx={{ width: "100%" }}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5분 단위
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="소요 시간(분)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                sx={{ width: "100%" }}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: 1,
                  max: 120,
                  step: 1,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset" sx={{ width: "100%" }}>
                <FormLabel component="legend">결과</FormLabel>
                <RadioGroup
                  row
                  value={success ? "success" : "failure"}
                  onChange={(e) => setSuccess(e.target.value === "success")}
                >
                  <FormControlLabel
                    value="success"
                    control={<Radio color="success" />}
                    label="성공"
                  />
                  <FormControlLabel
                    value="failure"
                    control={<Radio color="error" />}
                    label="실패"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {success && (
              <Grid item xs={12}>
                <FormControl component="fieldset" sx={{ width: "100%" }}>
                  <FormLabel component="legend">배변량</FormLabel>
                  <RadioGroup
                    row
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
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
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                label="메모"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                multiline
                rows={4}
                fullWidth
                placeholder="특이사항이 있으면 입력해주세요."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <CancelButton onCancel={onClose} />
          <SaveButton type="submit" isLoading={isSubmittingGlobal} />
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventForm;
