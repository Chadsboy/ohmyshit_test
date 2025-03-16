# Oh My Calendar

Supabase와 연동된 캘린더 애플리케이션입니다.

## 기능

- 캘린더에서 날짜별 이벤트 확인
- 이벤트 추가, 수정, 삭제
- 이벤트가 있는 날짜 하이라이트 표시
- 사용자 인증 (로그인/회원가입)

## 기술 스택

- React
- TypeScript
- Material-UI (MUI)
- React Router
- Supabase (백엔드 및 인증)
- Vite (빌드 도구)

## 설치 및 실행

1. 저장소 클론

```bash
git clone <repository-url>
cd react/my-app
```

2. 의존성 설치

```bash
npm install
```

3. Supabase 설정

- [Supabase](https://supabase.com/)에 가입하고 새 프로젝트를 생성합니다.
- SQL 에디터에서 다음 쿼리를 실행하여 필요한 테이블을 생성합니다:

```sql
-- 이벤트 테이블 생성
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- RLS(Row Level Security) 정책 설정
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 인증된 사용자만 자신의 이벤트를 볼 수 있도록 정책 생성
CREATE POLICY "Users can view their own events" ON events
  FOR SELECT USING (auth.uid() = user_id);

-- 인증된 사용자만 자신의 이벤트를 생성할 수 있도록 정책 생성
CREATE POLICY "Users can create their own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 인증된 사용자만 자신의 이벤트를 수정할 수 있도록 정책 생성
CREATE POLICY "Users can update their own events" ON events
  FOR UPDATE USING (auth.uid() = user_id);

-- 인증된 사용자만 자신의 이벤트를 삭제할 수 있도록 정책 생성
CREATE POLICY "Users can delete their own events" ON events
  FOR DELETE USING (auth.uid() = user_id);
```

4. 환경 변수 설정

- `.env.example` 파일을 `.env`로 복사합니다.
- Supabase 프로젝트의 URL과 anon key를 `.env` 파일에 입력합니다.

```
VITE_SUPABASE_URL=https://mudbrhhlmwlfjkylyuci.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11ZGJyaGhsbXdsZmpreWx5dWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NjY1OTgsImV4cCI6MjA1NzI0MjU5OH0.Mu-VIpNUAVvRrZdcmAj7q_pvKUsGN1QXloQe3uGK3tQ
```

5. 개발 서버 실행

```bash
npm run dev
```

## 프로젝트 구조

```
src/
├── components/       # 재사용 가능한 컴포넌트
├── contexts/         # React Context
├── hooks/            # 커스텀 훅
├── lib/              # 유틸리티 및 설정
├── pages/            # 페이지 컴포넌트
├── services/         # API 서비스
├── theme/            # 테마 설정
└── data/             # 정적 데이터
```

## 배포

1. 빌드

```bash
npm run build
```

2. 빌드된 파일은 `dist` 디렉토리에 생성됩니다. 이 파일들을 웹 서버에 업로드하여 배포할 수 있습니다.

## 라이센스

MIT

## 구글 맵스 API 설정

지도 기능을 사용하기 위해서는 구글 맵스 API 키가 필요합니다:

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속합니다.
2. 새 프로젝트를 생성하거나 기존 프로젝트를 선택합니다.
3. 사이드바에서 "API 및 서비스" > "라이브러리"로 이동합니다.
4. "Maps JavaScript API"를 검색하고 활성화합니다.
5. "사용자 인증 정보" 페이지로 이동하여 API 키를 생성합니다.
6. 생성된 API 키를 `.env.local` 파일에 다음과 같이 추가합니다:

```
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

## 개발 환경

- React 18
- TypeScript
- Vite
- Material UI
- @react-google-maps/api
