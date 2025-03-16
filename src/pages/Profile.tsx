import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
  Snackbar,
  MenuItem,
  Select,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { supabase } from "../lib/supabase";

interface UserData {
  email: string | null;
  gender: string | null;
  age_group: number | null;
  has_disease: boolean | null;
  avatar_url: string | null;
}

const Profile = () => {
  const [user, setUser] = useState<UserData>({
    email: null,
    gender: null,
    age_group: null,
    has_disease: null,
    avatar_url: null,
  });
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // 비밀번호 변경 폼 상태
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // 사용자 데이터 로드
  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true);

        // 현재 사용자 세션 가져오기
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          throw new Error("로그인 세션이 존재하지 않습니다.");
        }

        // 사용자 프로필 정보 가져오기
        const { data, error: profileError } = await supabase
          .from("users")
          .select("email, gender, age_group, has_disease, avatar_url")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        // 사용자 데이터가 없는 경우 생성
        if (!data) {
          console.log("사용자 데이터가 없습니다. 새로 생성합니다.");
          const { error: insertError } = await supabase.from("users").insert({
            id: session.user.id,
            email: session.user.email,
          });

          if (insertError) {
            throw insertError;
          }

          // 기본 사용자 데이터 설정
          setUser({
            email: session.user.email || null,
            gender: null,
            age_group: null,
            has_disease: false,
            avatar_url: null,
          });
        } else {
          setUser(data);
        }
      } catch (error: any) {
        console.error("사용자 데이터 로딩 오류:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

  // 폼 입력값 변경 처리
  const handleChange = (
    e: SelectChangeEvent | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // age_group Select 처리를 위한 특별 핸들러
  const handleAgeGroupChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value === "" ? null : parseInt(value, 10),
    }));
  };

  // 질병 유무 라디오 버튼 처리
  const handleDiseaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "true";
    setUser((prev) => ({
      ...prev,
      has_disease: value,
    }));
  };

  // 파일 업로드 처리
  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      setUploadLoading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // 세션 가져오기
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("로그인 세션이 존재하지 않습니다.");
      }

      // 파일 업로드
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 공개 URL 가져오기
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // 사용자 프로필 업데이트
      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar_url: publicUrl })
        .eq("id", session.user.id);

      if (updateError) {
        throw updateError;
      }

      // 상태 업데이트
      setUser({ ...user, avatar_url: publicUrl });
      setSuccess("프로필 이미지가 성공적으로 업데이트되었습니다.");
      setOpenSnackbar(true);
    } catch (error: any) {
      console.error("이미지 업로드 오류:", error.message);
      setError(error.message);
      setOpenSnackbar(true);
    } finally {
      setUploadLoading(false);
    }
  };

  // 사용자 정보 저장
  const handleSaveProfile = async () => {
    try {
      setSaveLoading(true);

      // 세션 가져오기
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("로그인 세션이 존재하지 않습니다.");
      }

      // 사용자 정보 업데이트
      const { error } = await supabase
        .from("users")
        .update({
          gender: user.gender,
          age_group: user.age_group,
          has_disease: user.has_disease,
        })
        .eq("id", session.user.id);

      if (error) {
        throw error;
      }

      setSuccess("프로필이 성공적으로 업데이트되었습니다.");
      setOpenSnackbar(true);
    } catch (error: any) {
      console.error("프로필 저장 오류:", error.message);
      setError(error.message);
      setOpenSnackbar(true);
    } finally {
      setSaveLoading(false);
    }
  };

  // 비밀번호 변경 입력 처리
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  // 비밀번호 변경 제출
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setPasswordError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (passwords.newPassword.length < 6) {
      setPasswordError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    try {
      setPasswordLoading(true);
      setPasswordError(null);

      // 비밀번호 변경
      const { error } = await supabase.auth.updateUser({
        password: passwords.newPassword,
      });

      if (error) {
        throw error;
      }

      // 폼 초기화
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      setSuccess("비밀번호가 성공적으로 변경되었습니다.");
      setOpenSnackbar(true);
    } catch (error: any) {
      console.error("비밀번호 변경 오류:", error.message);
      setPasswordError(error.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        내 계정
      </Typography>

      {/* 알림 스낵바 */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error || success}
        </Alert>
      </Snackbar>

      {/* 프로필 사진 섹션 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          프로필 사진
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            src={user.avatar_url || undefined}
            sx={{ width: 100, height: 100, mr: 2 }}
          >
            {!user.avatar_url && (user.email?.charAt(0).toUpperCase() || "U")}
          </Avatar>
          <Box>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="avatar-upload"
              type="file"
              onChange={handleAvatarUpload}
              disabled={uploadLoading}
            />
            <label htmlFor="avatar-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<PhotoCamera />}
                disabled={uploadLoading}
              >
                {uploadLoading ? "업로드 중..." : "사진 변경"}
              </Button>
            </label>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              JPG, PNG 또는 GIF 파일. 최대 10MB.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* 사용자 정보 섹션 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          사용자 정보
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="이메일 주소"
              value={user.email || ""}
              disabled
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="gender-label">성별</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                name="gender"
                value={user.gender || ""}
                label="성별"
                onChange={handleChange}
              >
                <MenuItem value="">선택 안함</MenuItem>
                <MenuItem value="male">남성</MenuItem>
                <MenuItem value="female">여성</MenuItem>
                <MenuItem value="other">기타</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="age-group-label">연령대</InputLabel>
              <Select
                labelId="age-group-label"
                id="age_group"
                name="age_group"
                value={user.age_group === null ? "" : String(user.age_group)}
                label="연령대"
                onChange={handleAgeGroupChange}
              >
                <MenuItem value="">선택 안함</MenuItem>
                <MenuItem value="10">10대</MenuItem>
                <MenuItem value="20">20대</MenuItem>
                <MenuItem value="30">30대</MenuItem>
                <MenuItem value="40">40대</MenuItem>
                <MenuItem value="50">50대</MenuItem>
                <MenuItem value="60">60대 이상</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">배변 관련 질병 유무</FormLabel>
              <RadioGroup
                row
                name="has_disease"
                value={user.has_disease?.toString() || "false"}
                onChange={handleDiseaseChange}
              >
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="없음"
                />
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="있음"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveProfile}
              disabled={saveLoading}
              sx={{ mt: 2 }}
            >
              {saveLoading ? "저장 중..." : "정보 저장"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* 비밀번호 변경 섹션 */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          비밀번호 변경
        </Typography>
        <form onSubmit={handleChangePassword}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="currentPassword"
                label="현재 비밀번호"
                type="password"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="newPassword"
                label="새 비밀번호"
                type="password"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="confirmNewPassword"
                label="새 비밀번호 확인"
                type="password"
                value={passwords.confirmNewPassword}
                onChange={handlePasswordChange}
                required
              />
            </Grid>

            {passwordError && (
              <Grid item xs={12}>
                <Alert severity="error">{passwordError}</Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={passwordLoading}
                sx={{ mt: 2 }}
              >
                {passwordLoading ? "변경 중..." : "비밀번호 변경"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile;
