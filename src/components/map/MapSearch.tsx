import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { useState, useCallback } from "react";

// 위치 정보 타입 정의
export interface LocationType {
  lat: number;
  lng: number;
  name: string;
}

interface MapSearchProps {
  onSearch?: (query: string) => void;
  onLocationSelect?: (location: LocationType) => void;
  onMyLocationClick?: () => void;
}

// 임시 검색 결과 데이터
const mockSearchResults: LocationType[] = [
  { name: "서울역", lat: 37.5546, lng: 126.9706 },
  { name: "강남역", lat: 37.498, lng: 127.0276 },
  { name: "홍대입구역", lat: 37.5571, lng: 126.9252 },
  { name: "명동", lat: 37.5634, lng: 126.985 },
  { name: "여의도", lat: 37.5216, lng: 126.9242 },
];

const MapSearch = ({
  onSearch,
  onLocationSelect,
  onMyLocationClick,
}: MapSearchProps) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<LocationType[]>([]);

  // 검색 처리 함수
  const handleSearch = useCallback(
    (query: string) => {
      setSearchValue(query);

      if (query.length > 1) {
        setIsSearching(true);

        // 실제 구현에서는 API 호출로 대체
        setTimeout(() => {
          const filteredResults = mockSearchResults.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
          );
          setSearchResults(filteredResults);
          setIsSearching(false);
        }, 300);

        onSearch?.(query);
      } else {
        setSearchResults([]);
      }
    },
    [onSearch]
  );

  // 위치 선택 처리 함수
  const handleLocationSelect = useCallback(
    (location: LocationType | null) => {
      if (location && onLocationSelect) {
        onLocationSelect(location);
      }
    },
    [onLocationSelect]
  );

  // 내 위치 찾기 처리 함수
  const handleMyLocationClick = useCallback(() => {
    if (onMyLocationClick) {
      onMyLocationClick();
    } else {
      // 기본 내 위치 찾기 구현
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location: LocationType = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              name: "내 위치",
            };
            onLocationSelect?.(location);
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
    }
  }, [onMyLocationClick, onLocationSelect]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        mb: 3,
        px: { xs: 2, sm: 3 },
        position: "relative",
      }}
    >
      <Autocomplete
        freeSolo
        options={searchResults}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.name
        }
        loading={isSearching}
        inputValue={searchValue}
        onInputChange={(_, value) => setSearchValue(value)}
        onChange={(_, value) => handleLocationSelect(value as LocationType)}
        renderOption={(props, option) => (
          <li {...props} key={option.name}>
            {option.name}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            placeholder="장소를 검색해주세요"
            variant="outlined"
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {isSearching ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                  <IconButton
                    onClick={handleMyLocationClick}
                    size="small"
                    sx={{ ml: 1 }}
                    title="내 위치 찾기"
                  >
                    <MyLocationIcon />
                  </IconButton>
                </>
              ),
              sx: {
                borderRadius: "12px",
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.02)",
                "&:hover": {
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.04)",
                },
              },
            }}
          />
        )}
      />
    </Box>
  );
};

export default MapSearch;
