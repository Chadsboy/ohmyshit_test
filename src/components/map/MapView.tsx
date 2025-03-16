import { Box, CircularProgress, Typography } from "@mui/material";
import { useCallback, useState, useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

interface MapViewProps {
  center?: { lat: number; lng: number };
  zoom?: number;
}

// 기본 중심 좌표 (서울)
const defaultCenter = {
  lat: 37.5665,
  lng: 126.978,
};

// 지도 스타일 설정
const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "8px",
};

// 지도 옵션
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

// 로딩 및 에러 컨테이너 스타일
const containerStyle = {
  width: "100%",
  height: {
    xs: "calc(100vh - 380px)",
    sm: "calc(100vh - 400px)",
    md: "500px",
  },
  maxHeight: "500px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: (theme: any) =>
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.02)",
  borderRadius: "12px",
};

const MapView = ({ center = defaultCenter, zoom = 14 }: MapViewProps) => {
  const [, setMap] = useState<google.maps.Map | null>(null);

  // 구글 맵스 API 로드
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey:
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY",
  });

  // 맵 로드 완료 시 호출
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // 언마운트 시 호출
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // 로딩 중 컴포넌트
  const loadingComponent = useMemo(
    () => (
      <Box sx={containerStyle}>
        <CircularProgress />
      </Box>
    ),
    []
  );

  // 에러 컴포넌트
  const errorComponent = useMemo(
    () => (
      <Box sx={{ ...containerStyle, p: 3 }}>
        <Typography color="error">
          지도를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.
        </Typography>
      </Box>
    ),
    []
  );

  // 로딩 중 표시
  if (!isLoaded) return loadingComponent;

  // 로드 에러 표시
  if (loadError) return errorComponent;

  return (
    <Box
      sx={{
        width: "100%",
        height: {
          xs: "calc(100vh - 380px)",
          sm: "calc(100vh - 400px)",
          md: "500px",
        },
        maxHeight: "500px",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.02)",
        borderRadius: "12px",
        overflow: "hidden",
        mx: "auto",
        px: { xs: 2, sm: 3 },
      }}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        <Marker position={center} />
      </GoogleMap>
    </Box>
  );
};

export default MapView;
