import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ErrorIcon from "@mui/icons-material/Error";
import VideocamIcon from "@mui/icons-material/Videocam";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const Help = () => {
  // 자주 묻는 질문 목록
  const faqs = [
    {
      question: "배변 기록은 어떻게 추가하나요?",
      answer:
        "하단 메뉴에서 '캘린더' 아이콘을 선택한 후, 날짜를 선택하고 + 버튼을 눌러 새 기록을 추가할 수 있습니다.",
    },
    {
      question: "내 건강 점수는 어떻게 계산되나요?",
      answer:
        "건강 점수는 배변 패턴, 규칙성, 배변량 등을 종합적으로 분석하여 계산됩니다. 정기적인 기록이 더 정확한 점수를 제공합니다.",
    },
    {
      question: "다른 기기에서도 내 정보를 볼 수 있나요?",
      answer:
        "네, 동일한 계정으로 로그인하면 모든 기기에서 동일한 데이터를 확인할 수 있습니다.",
    },
    {
      question: "앱에서 화장실 위치 정보가 부정확합니다. 어떻게 해야 하나요?",
      answer:
        "부정확한 정보는 문의하기 페이지를 통해 알려주세요. 가능한 빨리 수정하겠습니다.",
    },
    {
      question: "데이터가 모두 안전하게 저장되나요?",
      answer:
        "네, 모든 개인 정보와 건강 데이터는 암호화되어 안전하게 저장됩니다. 제3자와 공유되지 않습니다.",
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <HelpIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
          <Typography variant="h4" component="h1">
            도움말 센터
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          건강도우미 앱 사용 중 궁금한 점이 있으시면 이곳에서 답변을 찾아보세요.
        </Typography>
      </Paper>

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ mt: 4, mb: 3 }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LiveHelpIcon color="primary" sx={{ mr: 1 }} />
          자주 묻는 질문 (FAQ)
        </Box>
      </Typography>

      {faqs.map((faq, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" color="primary" gutterBottom>
              {faq.question}
            </Typography>
            <Typography variant="body1">{faq.answer}</Typography>
          </CardContent>
        </Card>
      ))}

      <Divider sx={{ my: 4 }} />

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ mt: 4, mb: 3 }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SupportAgentIcon color="primary" sx={{ mr: 1 }} />
          추가 지원
        </Box>
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <QuestionAnswerIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">문의하기</Typography>
              </Box>
              <Typography variant="body2" paragraph>
                더 자세한 도움이 필요하시면 문의하기를 통해 질문을 보내주세요.
              </Typography>
              <Link href="/contact" variant="body2">
                문의하기 페이지로 이동 &gt;
              </Link>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <VideocamIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">비디오 튜토리얼</Typography>
              </Box>
              <Typography variant="body2" paragraph>
                앱 사용 방법을 자세히 보여주는 비디오 튜토리얼을 확인하세요.
              </Typography>
              <Link href="#" variant="body2">
                비디오 튜토리얼 보기 &gt;
              </Link>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card
        sx={{ mt: 4, bgcolor: "#f8f9fa", border: "none", boxShadow: "none" }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <ErrorIcon color="warning" sx={{ mr: 1 }} />
            <Typography variant="h6">문제 신고</Typography>
          </Box>
          <Typography variant="body2" paragraph>
            앱 사용 중 오류가 발생하셨나요? 아래 정보를 포함하여 신고해 주세요:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <ErrorIcon color="warning" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="발생한 문제에 대한 자세한 설명" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ErrorIcon color="warning" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="어떤 페이지에서 발생했는지" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ErrorIcon color="warning" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="사용 중인 기기 및 브라우저 정보" />
            </ListItem>
          </List>
          <Link href="/contact" variant="body2">
            문제 신고하기 &gt;
          </Link>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Help;
