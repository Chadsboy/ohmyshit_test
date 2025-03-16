import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Divider,
  Link,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
  });

  // 오류 상태 관리
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    category: false,
    subject: false,
    message: false,
  });

  // 알림 상태 관리
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // 폼 필드 변경 처리
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // 필드에 값이 입력되면 오류 상태 초기화
    if (value.trim() !== "") {
      setErrors({
        ...errors,
        [name]: false,
      });
    }
  };

  // Select 필드 변경 처리
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (value !== "") {
      setErrors({
        ...errors,
        [name]: false,
      });
    }
  };

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 폼 유효성 검사
    const newErrors = {
      name: formData.name.trim() === "",
      email: formData.email.trim() === "" || !formData.email.includes("@"),
      category: formData.category === "",
      subject: formData.subject.trim() === "",
      message: formData.message.trim() === "",
    };

    setErrors(newErrors);

    // 오류가 있으면 제출 중단
    if (Object.values(newErrors).some((error) => error)) {
      setAlert({
        open: true,
        message: "모든 필드를 올바르게 작성해주세요.",
        severity: "error",
      });
      return;
    }

    // 여기서 실제 API 호출 등의 제출 로직 구현
    console.log("제출된 데이터:", formData);

    // 성공 알림 표시
    setAlert({
      open: true,
      message: "문의가 성공적으로 전송되었습니다. 곧 답변 드리겠습니다.",
      severity: "success",
    });

    // 폼 초기화
    setFormData({
      name: "",
      email: "",
      category: "",
      subject: "",
      message: "",
    });
  };

  // 알림 닫기 처리
  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      open: false,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <ContactSupportIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
          <Typography variant="h4" component="h1">
            문의하기
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          건강도우미 앱 관련 문의사항이나 의견을 보내주세요. 최대한 빠르게 답변
          드리겠습니다.
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        {/* 왼쪽: 연락처 정보 */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                연락처 정보
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
                <EmailIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    이메일
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    support@healthcareapp.com
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
                <PhoneIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    전화번호
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    02-123-4567
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
                <LocationOnIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    주소
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    서울특별시 강남구 테헤란로 123
                    <br />
                    건강도우미 빌딩 8층
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" sx={{ mt: 4 }}>
                운영 시간: 평일 오전 9시 ~ 오후 6시
                <br />
                (공휴일 제외)
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Link href="/help" variant="body2">
                  도움말 센터 방문하기 &gt;
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 오른쪽: 문의 양식 */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                문의 양식
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="name"
                      label="이름"
                      value={formData.name}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={errors.name}
                      helperText={errors.name ? "이름을 입력해주세요" : ""}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="email"
                      label="이메일"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={errors.email}
                      helperText={
                        errors.email ? "유효한 이메일을 입력해주세요" : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth required error={errors.category}>
                      <InputLabel id="category-label">문의 유형</InputLabel>
                      <Select
                        labelId="category-label"
                        name="category"
                        value={formData.category}
                        onChange={handleSelectChange}
                        label="문의 유형"
                      >
                        <MenuItem value="기술지원">기술 지원</MenuItem>
                        <MenuItem value="계정문의">계정 관련 문의</MenuItem>
                        <MenuItem value="사용방법">앱 사용 방법</MenuItem>
                        <MenuItem value="기능제안">기능 제안</MenuItem>
                        <MenuItem value="불만/오류">
                          불만 신고 / 오류 신고
                        </MenuItem>
                        <MenuItem value="기타">기타</MenuItem>
                      </Select>
                      {errors.category && (
                        <FormControl error>
                          <FormHelperText>
                            문의 유형을 선택해주세요
                          </FormHelperText>
                        </FormControl>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="subject"
                      label="제목"
                      value={formData.subject}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={errors.subject}
                      helperText={errors.subject ? "제목을 입력해주세요" : ""}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="message"
                      label="메시지"
                      multiline
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={errors.message}
                      helperText={errors.message ? "메시지를 입력해주세요" : ""}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<SendIcon />}
                      fullWidth={isMobile}
                      sx={{ mt: 2, px: 4 }}
                    >
                      문의 보내기
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 알림 메시지 */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact;
