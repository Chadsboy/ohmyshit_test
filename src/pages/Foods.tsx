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
      <Box
        sx={{
          width: "100%",
          height: "100%",
          pt: 0,
          px: 1,
          pb: 1,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{
            mb: 1,
            fontSize: { xs: "1.3rem", sm: "1.6rem" },
            mt: 0,
            fontWeight: 700,
            letterSpacing: "0.05em",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            fontFamily: "'Montserrat', 'Roboto', sans-serif",
            position: "relative",
            display: "inline-block",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "-3px",
              left: "50%",
              width: "40%",
              height: "2px",
              background:
                "linear-gradient(to right, transparent, rgba(25, 118, 210, 0.7), transparent)",
              transform: "translateX(-50%)",
              animation: "pulse 2s infinite ease-in-out",
            },
            "@keyframes pulse": {
              "0%": { opacity: 0.6 },
              "50%": { opacity: 1 },
              "100%": { opacity: 0.6 },
            },
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
    <Box
      sx={{
        width: "100%",
        height: "100%",
        pt: 0,
        px: 2,
        pb: 2,
        textAlign: "center",
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{
          mb: 1,
          fontSize: { xs: "1.3rem", sm: "1.6rem" },
          mt: 0,
          fontWeight: 700,
          letterSpacing: "0.05em",
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
          fontFamily: "'Montserrat', 'Roboto', sans-serif",
          position: "relative",
          display: "inline-block",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-3px",
            left: "50%",
            width: "40%",
            height: "2px",
            background:
              "linear-gradient(to right, transparent, rgba(25, 118, 210, 0.7), transparent)",
            transform: "translateX(-50%)",
            animation: "pulse 2s infinite ease-in-out",
          },
          "@keyframes pulse": {
            "0%": { opacity: 0.6 },
            "50%": { opacity: 1 },
            "100%": { opacity: 0.6 },
          },
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
