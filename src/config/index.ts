// 환경 변수 관리
interface Config {
  supabase: {
    url: string;
    anonKey: string;
  };
  app: {
    name: string;
    version: string;
  };
}

// 환경 변수에서 값을 가져오거나 기본값 사용
const config: Config = {
  supabase: {
    url:
      import.meta.env.VITE_SUPABASE_URL ||
      "https://mudbrhhlmwlfjkylyuci.supabase.co",
    anonKey:
      import.meta.env.VITE_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11ZGJyaGhsbXdsZmpreWx5dWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NjY1OTgsImV4cCI6MjA1NzI0MjU5OH0.Mu-VIpNUAVvRrZdcmAj7q_pvKUsGN1QXloQe3uGK3tQ",
  },
  app: {
    name: "캘린더 앱",
    version: "1.0.0",
  },
};

export default config;
