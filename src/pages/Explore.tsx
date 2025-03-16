import { Box, Typography } from "@mui/material";
import MapSearch from "../components/map/MapSearch";
import MapView from "../components/map/MapView";
import { useState, useCallback } from "react";
import { LocationType } from "../components/map/MapSearch";

/**
 * 지도 탐색 페이지 컴포넌트
 */
const Explore = () => {
  // 지도 상태 관리
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 37.5665, // 서울 중심
    lng: 126.978,
  });
  const [zoom, setZoom] = useState<number>(14);
  const [searchQuery, setSearchQuery] = useState<string>("");

  /**
   * 검색어 변경 핸들러
   */
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  /**
   * 위치 선택 핸들러
   */
  const handleLocationSelect = useCallback((location: LocationType) => {
    if (location && location.lat && location.lng) {
      setMapCenter({ lat: location.lat, lng: location.lng });
      setZoom(16); // 위치 선택 시 줌 레벨 증가
    }
  }, []);

  /**
   * 내 위치 찾기 핸들러
   */
  const handleMyLocationClick = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(newLocation);
          setZoom(17); // 내 위치 선택 시 줌 레벨 더 증가
        },
        (error) => {
          console.error("위치 정보를 가져오는데 실패했습니다:", error);
          alert(
            "위치 정보를 가져오는데 실패했습니다. 브라우저 설정에서 위치 접근 권한을 확인해주세요."
          );
        }
      );
    } else {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
    }
  }, []);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          mb: 3,
        }}
      >
        지도 입니다
      </Typography>

      <MapSearch
        onSearch={handleSearch}
        onLocationSelect={handleLocationSelect}
        onMyLocationClick={handleMyLocationClick}
      />

      <MapView center={mapCenter} zoom={zoom} />
    </Box>
  );
};

export default Explore;
