import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  isSaving: boolean;
  setSaving: (saving: boolean) => void;
  resetAllLoadingStates: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [isSaving, setSaving] = useState(false);

  // 세션 타임아웃 시 모든 로딩 상태 초기화
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log("LoadingContext - 글로벌 로딩 상태 타임아웃 초기화");
        resetAllLoadingStates();
      }
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  const resetAllLoadingStates = () => {
    setLoading(false);
    setSaving(false);
    // 여기에 추가 로딩 상태가 있다면 초기화
  };

  const value = {
    isLoading,
    setLoading,
    isSaving,
    setSaving,
    resetAllLoadingStates,
  };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};

export default LoadingContext;
