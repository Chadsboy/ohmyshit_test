import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Box,
  Button,
  Stack,
  Divider,
  Link,
  Chip,
} from "@mui/material";
import { ShoppingCart, Favorite, StarRate } from "@mui/icons-material";

const Shop = () => {
  // 예시 상품 데이터
  const products = [
    {
      id: 1,
      name: "샘표 장수간장",
      price: 12000,
      image: "https://via.placeholder.com/300x200?text=장수간장",
      description: "자연 발효된 전통 간장, 깊은 맛",
    },
    {
      id: 2,
      name: "건강한 배변 티",
      price: 15000,
      image: "https://via.placeholder.com/300x200?text=배변티",
      description: "장 건강에 좋은 허브 블렌드 티",
    },
    {
      id: 3,
      name: "바나나 섬유질 영양제",
      price: 25000,
      image: "https://via.placeholder.com/300x200?text=섬유질영양제",
      description: "천연 바나나 추출물 섬유질 보충제",
    },
    {
      id: 4,
      name: "자연 발효 요구르트",
      price: 8000,
      image: "https://via.placeholder.com/300x200?text=요구르트",
      description: "프로바이오틱스가 풍부한 요구르트",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4, mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        건강 식품 상점
      </Typography>

      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {product.name}
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  {product.price.toLocaleString()}원
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button variant="contained" fullWidth>
                  장바구니에 담기
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Shop;
