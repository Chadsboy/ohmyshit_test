import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Box,
  MenuItem,
  IconButton,
  Slide,
  FormLabel,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Close as CloseIcon, CheckCircle, Cancel } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ResultModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (result: {
    success: boolean;
    amount?: string;
    memo?: string;
  }) => void;
  isSaving?: boolean;
}

/**
 * 타이머 결과 입력 모달
 * 배변 성공 여부와 배변량, 메모를 입력할 수 있습니다.
 */
const ResultModal: React.FC<ResultModalProps> = ({
  open,
  onClose,
  onSave,
  isSaving = false,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [success, setSuccess] = useState<boolean>(true);
  const [amount, setAmount] = useState<string>("보통");
  const [memo, setMemo] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      success,
      amount: success ? amount : undefined,
      memo: memo.trim() !== "" ? memo : undefined,
    });
  };

  const handleClose = () => {
    setSuccess(true);
    setAmount("보통");
    setMemo("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : handleClose}
      fullScreen={fullScreen}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          display: "flex",
          alignItems: "center",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 600, flex: 1 }}
        >
          배변 결과 입력
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">배변에 성공했나요?</FormLabel>
            <RadioGroup
              row
              value={success ? "success" : "fail"}
              onChange={(e) => setSuccess(e.target.value === "success")}
            >
              <FormControlLabel
                value="success"
                control={
                  <Radio
                    color="success"
                    icon={<CheckCircle color="action" />}
                    checkedIcon={<CheckCircle />}
                  />
                }
                label="성공"
              />
              <FormControlLabel
                value="fail"
                control={
                  <Radio
                    color="error"
                    icon={<Cancel color="action" />}
                    checkedIcon={<Cancel />}
                  />
                }
                label="실패"
              />
            </RadioGroup>
          </FormControl>

          {success && (
            <FormControl fullWidth sx={{ mb: 3 }}>
              <FormLabel component="legend">대변량</FormLabel>
              <RadioGroup
                row
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              >
                <FormControlLabel
                  value="small"
                  control={<Radio />}
                  label="소량"
                />
                <FormControlLabel
                  value="medium"
                  control={<Radio />}
                  label="보통"
                />
                <FormControlLabel
                  value="large"
                  control={<Radio />}
                  label="다량"
                />
              </RadioGroup>
            </FormControl>
          )}

          <TextField
            label="메모"
            multiline
            rows={3}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            fullWidth
            variant="outlined"
            placeholder="메모를 입력하세요 (선택사항)"
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleClose}
            color="inherit"
            disabled={isSaving}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            취소
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={isSaving || (success && amount === "")}
            startIcon={isSaving ? <CircularProgress size={20} /> : null}
          >
            {isSaving ? "저장 중..." : "저장"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ResultModal;
