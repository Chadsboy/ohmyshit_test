import React, { useEffect } from "react";
import { Button, CircularProgress, ButtonProps } from "@mui/material";
import { BUTTON_TEXTS } from "../../constants/uiText";
import { useLoading } from "../../contexts/LoadingContext";

interface SaveButtonProps extends ButtonProps {
  isLoading?: boolean; // 로컬 로딩 상태 (하위 호환성)
  saveType?: "default" | "info";
  onSave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  useGlobalLoading?: boolean; // 글로벌 로딩 상태 사용 여부
}

const SaveButton: React.FC<SaveButtonProps> = ({
  isLoading: localIsLoading,
  saveType = "default",
  onSave,
  disabled,
  useGlobalLoading = true, // 기본값은 글로벌 로딩 상태 사용
  ...buttonProps
}) => {
  const { isSaving: globalIsLoading } = useLoading();

  // 로컬 로딩 상태와 글로벌 로딩 상태 중 선택
  const isLoading = useGlobalLoading ? globalIsLoading : !!localIsLoading;

  const buttonText = isLoading
    ? BUTTON_TEXTS.SAVING
    : saveType === "info"
    ? BUTTON_TEXTS.SAVE_INFO
    : BUTTON_TEXTS.SAVE;

  return (
    <Button
      variant="contained"
      color="primary"
      disabled={disabled || isLoading}
      onClick={onSave}
      startIcon={
        isLoading ? <CircularProgress size={20} color="inherit" /> : null
      }
      {...buttonProps}
    >
      {buttonText}
    </Button>
  );
};

export default SaveButton;
