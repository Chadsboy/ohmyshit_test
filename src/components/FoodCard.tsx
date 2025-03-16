import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FoodItem } from "../data/foodsData";

interface FoodCardProps {
  item: FoodItem;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

/**
 * 모바일 화면에서 사용하는 음식 카드 컴포넌트
 */
const FoodCard = ({ item, isFavorite, onToggleFavorite }: FoodCardProps) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 1,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        border: "1px solid rgba(0,0,0,0.03)",
      }}
    >
      <CardMedia
        component="img"
        height="120"
        image={`${item.img}?w=500&fit=crop&auto=format`}
        alt={item.title}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1, pb: 0.5, pt: 1, px: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 0.5,
          }}
        >
          <Typography
            variant="subtitle1"
            component="div"
            noWrap
            sx={{
              flexGrow: 1,
              mr: 1,
            }}
          >
            {item.title}
          </Typography>
          <Box sx={{ display: "flex", flexShrink: 0 }}>
            <IconButton
              aria-label={`좋아요 ${item.title}`}
              onClick={() => onToggleFavorite(item.id)}
              color={isFavorite ? "error" : "default"}
              size="small"
              sx={{ p: 0.5 }}
            >
              <FavoriteIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label={`정보 ${item.title}`}
              size="small"
              sx={{ p: 0.5 }}
            >
              <InfoIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "0.75rem",
            lineHeight: 1.2,
          }}
        >
          {item.subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FoodCard;
