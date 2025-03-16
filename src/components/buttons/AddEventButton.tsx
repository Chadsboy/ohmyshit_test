import React from "react";
import { Button } from "@mui/material";

interface AddEventButtonProps {
  onClick: () => void;
}

const AddEventButton: React.FC<AddEventButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      sx={{
        mt: { xs: 4, sm: 4 },
        position: { xs: "static", sm: "absolute" },
        bottom: { sm: 16 },
        right: { sm: 10 },
        fontSize: { xs: "0.875rem", sm: "0.875rem" },
        py: { xs: 1, sm: 1 },
        px: { xs: 2, sm: 2 },
        zIndex: 10,
      }}
    >
      직접 기록 추가
    </Button>
  );
};

export default AddEventButton;
