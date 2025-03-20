import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { BUTTON_TEXTS } from "../../constants/uiText";

interface CancelButtonProps extends ButtonProps {
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const CancelButton: React.FC<CancelButtonProps> = ({
  onCancel,
  ...buttonProps
}) => {
  return (
    <Button color="inherit" onClick={onCancel} {...buttonProps}>
      {BUTTON_TEXTS.CANCEL}
    </Button>
  );
};

export default CancelButton;
