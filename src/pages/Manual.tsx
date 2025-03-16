import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BookIcon from "@mui/icons-material/Book";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ExploreIcon from "@mui/icons-material/Explore";

const Manual = () => {
  const [expanded, setExpanded] = useState<string | false>("panel1");

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Container maxWidth="md" sx={{ py: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          앱 사용 설명서
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          건강도우미 앱의 각 기능과 사용법에 대한 안내입니다. 아래에서 각 섹션을
          확인하세요.
        </Typography>
      </Paper>

      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
        sx={{ mb: 2 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <HomeIcon color="primary" sx={{ mr: 2 }} />
            <Typography variant="h6">홈 화면 사용법</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            홈 화면에서는 건강 현황과 일일 배변 통계를 확인할 수 있습니다.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="건강 캐릭터는 현재 건강 상태를 시각적으로 보여줍니다." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="일일 배변 통계는 오늘의 배변 기록을 요약해서 보여줍니다." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="건강 점수는 배변 기록, 활동량 등을 종합하여 계산됩니다." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
        sx={{ mb: 2 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CalendarMonthIcon color="primary" sx={{ mr: 2 }} />
            <Typography variant="h6">캘린더 사용법</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            캘린더 페이지에서는 배변 기록을 관리할 수 있습니다.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="캘린더에서 날짜를 선택하면 해당 날짜의 배변 기록을 확인할 수 있습니다." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="+ 버튼을 눌러 새로운 배변 기록을 추가할 수 있습니다." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="각 기록은 시간, 성공 여부, 배변량 등의 정보를 포함합니다." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
        sx={{ mb: 2 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FavoriteIcon color="primary" sx={{ mr: 2 }} />
            <Typography variant="h6">식약품 페이지 사용법</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            식약품 페이지에서는 장 건강에 좋은 식품과 약품 정보를 확인할 수
            있습니다.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="카테고리별로 다양한 식품과 약품 정보를 제공합니다." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="각 항목을 선택하면 상세 정보와 효능을 확인할 수 있습니다." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="즐겨찾기 기능을 사용하여 자주 확인하는 항목을 저장할 수 있습니다." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
        sx={{ mb: 2 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ExploreIcon color="primary" sx={{ mr: 2 }} />
            <Typography variant="h6">탐색 페이지 사용법</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography paragraph>
            탐색 페이지에서는 주변 화장실 위치와 정보를 확인할 수 있습니다.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="지도에서 현재 위치 주변의 화장실을 확인할 수 있습니다." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="화장실 아이콘을 선택하면 상세 정보와 리뷰를 볼 수 있습니다." />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="검색 기능을 사용하여 특정 지역의 화장실을 찾을 수 있습니다." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ textAlign: "center" }}>
        <BookIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          더 자세한 도움이 필요하신가요?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          문의하기 페이지를 통해 궁금한 점을 물어보세요.
        </Typography>
      </Box>
    </Container>
  );
};

export default Manual;
