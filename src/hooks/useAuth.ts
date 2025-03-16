import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginWithEmail,
  loginWithGoogle,
  signupWithEmail,
  signupWithGoogle,
  logout,
  getCurrentSession,
  getCurrentUser,
  onAuthStateChange,
} from "../services/auth";

export interface User {
  id: string;
  email: string;
  name?: string;
  user_metadata?: {
    name?: string;
  };
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  // 현재 사용자 정보 로드
  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const session = await getCurrentSession();
      if (session && session.session) {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData as unknown as User);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("사용자 정보 로드 오류:", err);
      setError(err as Error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 사용자 정보 로드
  useEffect(() => {
    loadUser();

    // 인증 상태 변경 리스너 설정
    const subscription = onAuthStateChange(async (event, _) => {
      console.log("인증 상태 변경 감지:", event);
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        // 토큰 갱신이나 로그인 시 유저 정보만 업데이트
        await loadUser();
      } else if (event === "SIGNED_OUT") {
        // 로그아웃 시 유저 정보만 초기화 (리다이렉트는 App.tsx에서 처리)
        setUser(null);
      }
    });

    // 클린업 함수
    return () => {
      subscription.unsubscribe();
    };
  }, [loadUser, navigate]);

  // 이메일 로그인
  const handleEmailLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await loginWithEmail(email, password);
      await loadUser();
      // 성공 시에만 홈으로 이동
      navigate("/");
      return true;
    } catch (err) {
      console.error("이메일 로그인 오류:", err);
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 구글 로그인
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await loginWithGoogle();
      // 리다이렉트되므로 여기서는 loadUser를 호출하지 않음
      return true;
    } catch (err) {
      console.error("구글 로그인 오류:", err);
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 이메일 회원가입
  const handleEmailSignup = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      await signupWithEmail(email, password, { name });
      navigate("/login");
      return true;
    } catch (err) {
      console.error("이메일 회원가입 오류:", err);
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 구글 회원가입
  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError(null);
      await signupWithGoogle();
      // 리다이렉트되므로 여기서는 loadUser를 호출하지 않음
      return true;
    } catch (err) {
      console.error("구글 회원가입 오류:", err);
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      setLoading(true);
      setError(null);
      await logout();
      setUser(null);
      navigate("/login");
      return true;
    } catch (err) {
      console.error("로그아웃 오류:", err);
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 세션 체크 (타임아웃 포함)
  const checkSession = async (timeout = 5000) => {
    return new Promise<boolean>((resolve) => {
      let isResolved = false;

      // 타임아웃 설정
      const timeoutId = setTimeout(() => {
        if (!isResolved) {
          console.log("세션 체크 타임아웃");
          isResolved = true;
          resolve(false);
        }
      }, timeout);

      // 세션 체크 수행
      getCurrentSession()
        .then(({ session }) => {
          if (!isResolved) {
            clearTimeout(timeoutId);
            isResolved = true;
            resolve(!!session);
          }
        })
        .catch((err) => {
          console.error("세션 체크 오류:", err);
          if (!isResolved) {
            clearTimeout(timeoutId);
            isResolved = true;
            resolve(false);
          }
        });
    });
  };

  return {
    user,
    loading,
    error,
    handleEmailLogin,
    handleGoogleLogin,
    handleEmailSignup,
    handleGoogleSignup,
    handleLogout,
    checkSession,
    loadUser,
  };
};
