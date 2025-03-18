import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  ImageList,
  useMediaQuery,
  useTheme,
  Grid,
  CircularProgress,
} from "@mui/material";
import { FoodItem } from "../data/foodsData";
import FoodCard from "../components/FoodCard";
import FoodListItem from "../components/FoodListItem";
import { foodService } from "../services/foodService";

/**
 * 식약품 페이지 컴포넌트
 */
const Foods = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // 상태 관리
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});

  // 데이터 로드
  useEffect(() => {
    const loadFoods = async () => {
      try {
        setLoading(true);
        const data = await foodService.getAllFoods();
        setFoods(data);
      } catch (error) {
        console.error(
          "식약품 데이터를 불러오는 중 오류가 발생했습니다:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadFoods();
  }, []);

  // 좋아요 토글 핸들러
  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 화면 크기에 따른 열 수 조정
  const getCols = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 모바일 화면에서는 그리드 형태로 표시 (2열)
  if (isMobile) {
    return (
      <Box sx={{ width: "100%", height: "100%", p: 1 }}>
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            mb: 2,
          }}
        >
          Oh My Hea!th Foods
        </Typography>

        <Grid container spacing={0.5} sx={{ pb: 7 }}>
          {foods.map((item) => (
            <Grid item xs={6} key={item.id} sx={{ p: 0.5 }}>
              <FoodCard
                item={item}
                isFavorite={!!favorites[item.id]}
                onToggleFavorite={handleToggleFavorite}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // 태블릿 및 데스크탑 화면에서는 ImageList 형태로 표시
  return (
    <Box sx={{ width: "100%", height: "100%", p: 2 }}>
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          mb: 3,
        }}
      >
        Oh My Hea!th Foods
      </Typography>

      <ImageList
        sx={{
          width: "100%",
          height: "calc(100vh - 250px)",
          overflow: "auto",
          mb: 2,
          "& .MuiImageListItem-root": {
            overflow: "hidden",
            borderRadius: 2,
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
            },
          },
        }}
        cols={getCols()}
        rowHeight={250}
        gap={16}
      >
        {foods.map((item) => (
          <FoodListItem
            key={item.id}
            item={item}
            isFavorite={!!favorites[item.id]}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </ImageList>
    </Box>
  );
};

export default Foods;
