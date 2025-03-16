import { supabase } from "../lib/supabase";

// 이메일 비밀번호로 로그인
export const loginWithEmail = async (email: string, password: string) => {
  try {
    console.log("이메일 로그인 시도:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("로그인 실패:", error);
      throw error;
    }

    console.log("로그인 성공:", data);
    return data;
  } catch (error) {
    console.error("로그인 오류:", error);
    throw error;
  }
};

// 구글 소셜 로그인
export const loginWithGoogle = async () => {
  try {
    console.log("Google 로그인 시도");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      console.error("Google 로그인 실패:", error);
      throw error;
    }

    console.log("Google 로그인 리다이렉트:", data);
    return data;
  } catch (error) {
    console.error("Google 로그인 오류:", error);
    throw error;
  }
};

// 회원가입
export const signupWithEmail = async (
  email: string,
  password: string,
  userData: { name: string }
) => {
  try {
    console.log("회원가입 시도:", email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) {
      console.error("회원가입 실패:", error);
      throw error;
    }

    console.log("회원가입 성공:", data);
    return data;
  } catch (error) {
    console.error("회원가입 오류:", error);
    throw error;
  }
};

// 구글 회원가입
export const signupWithGoogle = async () => {
  // 구글 로그인과 동일한 메서드 사용
  return loginWithGoogle();
};

// 로그아웃
export const logout = async () => {
  try {
    console.log("로그아웃 시도...");

    // 로컬 스토리지에서 Supabase 관련 데이터 제거
    localStorage.removeItem("supabase.auth.token");
    localStorage.removeItem("supabase.auth.refreshToken");

    // 로그아웃 시도
    const { error } = await supabase.auth.signOut();

    if (error) {
      // 세션 관련 오류인 경우에도 계속 진행
      if (error.message.includes("Session") || error.message.includes("JWT")) {
        console.warn(
          "세션 관련 오류가 발생했지만 로그아웃 처리를 계속합니다:",
          error
        );
      } else {
        console.error("로그아웃 오류:", error);
        throw error;
      }
    }

    console.log("로그아웃 성공");

    // 로컬 스토리지 비우기
    for (const key in localStorage) {
      if (key.startsWith("sb-")) {
        localStorage.removeItem(key);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("로그아웃 오류:", error);
    throw error;
  }
};

// 현재 세션 가져오기
export const getCurrentSession = async () => {
  try {
    console.log("세션 확인 중...");
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("세션 확인 오류:", error);
      throw error;
    }

    console.log("세션 데이터:", data);
    return data;
  } catch (error) {
    console.error("세션 확인 오류:", error);
    throw error;
  }
};

// 현재 사용자 정보 가져오기
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("사용자 정보 가져오기 오류:", error);
      throw error;
    }

    return user;
  } catch (error) {
    console.error("사용자 정보 가져오기 오류:", error);
    throw error;
  }
};

// 인증 상태 변경 리스너 설정
export const onAuthStateChange = (
  callback: (event: string, session: any) => void
) => {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    console.log("인증 상태 변경:", event, session);
    callback(event, session);
  });

  return data.subscription;
};
