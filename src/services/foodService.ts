import { foodItems, FoodItem } from "../data/foodsData";

/**
 * 식약품 데이터 서비스
 * 현재는 로컬 데이터를 사용하지만, 나중에 데이터베이스 연결로 변경 가능
 */
export const foodService = {
  /**
   * 모든 식약품 데이터 가져오기
   */
  getAllFoods: async (): Promise<FoodItem[]> => {
    // 실제 API 호출로 대체 가능
    return Promise.resolve(foodItems);
  },

  /**
   * ID로 특정 식약품 데이터 가져오기
   */
  getFoodById: async (id: number): Promise<FoodItem | undefined> => {
    // 실제 API 호출로 대체 가능
    const food = foodItems.find((item) => item.id === id);
    return Promise.resolve(food);
  },

  /**
   * 키워드로 식약품 검색하기
   */
  searchFoods: async (keyword: string): Promise<FoodItem[]> => {
    // 실제 API 호출로 대체 가능
    const searchResult = foodItems.filter(
      (item) => item.title.includes(keyword) || item.subtitle.includes(keyword)
    );
    return Promise.resolve(searchResult);
  },

  /**
   * 카테고리별 식약품 가져오기 (향후 확장 가능)
   */
  getFoodsByCategory: async (category: string): Promise<FoodItem[]> => {
    // 실제 API 호출로 대체 가능
    // 현재 데이터에는 카테고리가 없으므로 모든 데이터 반환
    return Promise.resolve(foodItems);
  },
};
