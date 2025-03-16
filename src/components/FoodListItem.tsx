import {
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Box,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FoodItem } from "../data/foodsData";

interface FoodListItemProps {
  item: FoodItem;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

/**
 * 데스크탑/태블릿 화면에서 사용하는 음식 리스트 아이템 컴포넌트
 */
const FoodListItem = ({
  item,
  isFavorite,
  onToggleFavorite,
}: FoodListItemProps) => {
  return (
    <ImageListItem>
      <img
        src={`${item.img}?w=248&fit=crop&auto=format`}
        srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
        alt={item.title}
        loading="lazy"
        style={{ height: "100%", objectFit: "cover" }}
      />
      <ImageListItemBar
        title={item.title}
        subtitle={item.subtitle}
        actionIcon={
          <Box sx={{ display: "flex" }}>
            <IconButton
              sx={{
                color: isFavorite ? "error.main" : "rgba(255, 255, 255, 0.54)",
              }}
              aria-label={`좋아요 ${item.title}`}
              onClick={() => onToggleFavorite(item.id)}
            >
              <FavoriteIcon />
            </IconButton>
            <IconButton
              sx={{ color: "rgba(255, 255, 255, 0.54)" }}
              aria-label={`info about ${item.title}`}
            >
              <InfoIcon />
            </IconButton>
          </Box>
        }
      />
    </ImageListItem>
  );
};

export default FoodListItem;
