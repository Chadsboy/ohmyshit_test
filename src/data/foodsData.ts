/**
 * 식약품 데이터 인터페이스
 */
export interface FoodItem {
  id: number;
  title: string;
  subtitle: string;
  img: string;
  featured?: boolean;
}

/**
 * 식약품 데이터
 */
export const foodItems: FoodItem[] = [
  {
    id: 1,
    title: "블루베리",
    subtitle: "항산화 효과가 뛰어난 과일",
    img: "./src/assets/food1.png",
    featured: true,
  },
  {
    id: 2,
    title: "연어",
    subtitle: "오메가-3가 풍부한 생선",
    img: "./src/assets/food2.png",
  },
  {
    id: 3,
    title: "시금치",
    subtitle: "철분이 풍부한 녹색 채소",
    img: "./src/assets/food3.png",
  },
  {
    id: 4,
    title: "아보카도",
    subtitle: "건강한 지방이 풍부한 과일",
    img: "./src/assets/food4.png",
  },
  {
    id: 5,
    title: "견과류",
    subtitle: "단백질과 건강한 지방의 원천",
    img: "./src/assets/food5.png",
  },
  {
    id: 6,
    title: "녹차",
    subtitle: "항산화 성분이 풍부한 음료",
    img: "./src/assets/food6.png",
  },
  {
    id: 7,
    title: "귀리",
    subtitle: "식이섬유가 풍부한 곡물",
    img: "./src/assets/food7.png",
  },
  {
    id: 8,
    title: "마늘",
    subtitle: "면역력 강화에 도움을 주는 식품",
    img: "./src/assets/food8.png",
  },
  {
    id: 9,
    title: "요거트",
    subtitle: "프로바이오틱스가 풍부한 유제품",
    img: "./src/assets/food9.png",
  },
  {
    id: 10,
    title: "토마토",
    subtitle: "리코펜이 풍부한 채소",
    img: "./src/assets/food10.png",
  },
];
