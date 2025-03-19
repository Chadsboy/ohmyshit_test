import { supabase } from "../lib/supabase";
import { Article, ServiceResponse } from "../types";
import { PostgrestError } from "@supabase/supabase-js";

/**
 * Article 서비스 클래스
 * articles 테이블과 상호작용하는 메서드를 제공합니다.
 */
export class ArticleService {
  /**
   * 모든 게시글을 가져옵니다.
   */
  static async getAllArticles(): Promise<ServiceResponse<Article[]>> {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;

      return { data: data as Article[], error: null };
    } catch (error) {
      console.error("모든 게시글 조회 중 오류:", error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * 특정 ID의 게시글을 가져옵니다.
   * @param id 게시글 ID
   */
  static async getArticleById(id: number): Promise<ServiceResponse<Article>> {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      // 조회수 증가 (비동기로 처리하고 반환은 바로 함)
      this.incrementViews(id).catch((e) =>
        console.error(`조회수 증가 중 오류 (ID ${id}):`, e)
      );

      return { data: data as Article, error: null };
    } catch (error) {
      console.error(`ID ${id} 게시글 조회 중 오류:`, error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * 카테고리별 게시글을 가져옵니다.
   * @param category 카테고리 이름
   */
  static async getArticlesByCategory(
    category: string
  ): Promise<ServiceResponse<Article[]>> {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("category", category)
        .order("date", { ascending: false });

      if (error) throw error;

      return { data: data as Article[], error: null };
    } catch (error) {
      console.error(`카테고리 ${category} 게시글 조회 중 오류:`, error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * 게시글 조회수를 증가시킵니다.
   * @param id 게시글 ID
   */
  private static async incrementViews(id: number): Promise<void> {
    try {
      // 현재 조회수 가져오기
      const { data, error } = await supabase
        .from("articles")
        .select("views")
        .eq("id", id)
        .single();

      if (error) throw error;

      // 조회수 증가 후 업데이트
      const currentViews = data.views || 0;
      const { error: updateError } = await supabase
        .from("articles")
        .update({ views: currentViews + 1 })
        .eq("id", id);

      if (updateError) throw updateError;
    } catch (error) {
      console.error(`ID ${id} 게시글 조회수 증가 중 오류:`, error);
      throw error;
    }
  }
}

// 편의를 위한 싱글톤 인스턴스
export const articleService = {
  getAllArticles: ArticleService.getAllArticles,
  getArticleById: ArticleService.getArticleById,
  getArticlesByCategory: ArticleService.getArticlesByCategory,
};
