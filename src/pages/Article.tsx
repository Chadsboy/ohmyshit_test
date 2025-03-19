import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  useTheme,
  useMediaQuery,
  Modal,
  Fade,
  Backdrop,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { articleService } from "../services/articleService";
import { Article as ArticleType } from "../types";

// 테이블 열 정의
interface Column {
  id: "id" | "category" | "title" | "date" | "views";
  label: string;
  minWidth?: number;
  mobileWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: any) => string;
  hideOnMobile?: boolean;
}

const columns: readonly Column[] = [
  {
    id: "id",
    label: "No",
    minWidth: 50,
    mobileWidth: 30,
    align: "center",
    hideOnMobile: false,
  },
  {
    id: "category",
    label: "분류",
    minWidth: 80,
    mobileWidth: 65,
    align: "center",
    hideOnMobile: false,
  },
  {
    id: "title",
    label: "제목",
    minWidth: 170,
    mobileWidth: 190,
    align: "left",
    hideOnMobile: false,
  },
  {
    id: "date",
    label: "등록날짜",
    minWidth: 120,
    align: "center",
    format: (value: string) => new Date(value).toLocaleDateString("ko-KR"),
    hideOnMobile: true,
  },
  {
    id: "views",
    label: "조회수",
    minWidth: 80,
    align: "center",
    format: (value: number) => value.toLocaleString("ko-KR"),
    hideOnMobile: true,
  },
];

const Article: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 상태 관리
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof ArticleType>("id");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [selectedArticle, setSelectedArticle] = useState<ArticleType | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로드
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const { data, error } = await articleService.getAllArticles();

        if (error) {
          throw error;
        }

        if (data) {
          setArticles(data);
        } else {
          setArticles([]);
        }
      } catch (err) {
        console.error("게시글을 불러오는 중 오류가 발생했습니다:", err);
        setError("게시글을 불러오는 중 오류가 발생했습니다");
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  // 정렬 함수
  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  // 문자열, 숫자, 날짜 모두 지원하는 비교 함수 생성
  function getComparator(
    order: "asc" | "desc",
    orderBy: keyof ArticleType
  ): (a: ArticleType, b: ArticleType) => number {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  // 정렬된 배열 반환
  function stableSort<T>(
    array: readonly T[],
    comparator: (a: T, b: T) => number
  ) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  // 정렬 핸들러
  const handleRequestSort = (property: keyof ArticleType) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // 페이지 변경 핸들러
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // 페이지당 행 수 변경 핸들러
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // 모달 열기/닫기 핸들러
  const handleOpen = async (article: ArticleType) => {
    try {
      // 상세 정보를 위해 API 호출 (조회수 증가 포함)
      const { data, error } = await articleService.getArticleById(article.id);

      if (error) {
        throw error;
      }

      if (data) {
        setSelectedArticle(data);
        // 로컬 상태에도 조회수 업데이트 반영
        setArticles((prev) =>
          prev.map((a) => (a.id === data.id ? { ...a, views: data.views } : a))
        );
      } else {
        setSelectedArticle(article);
      }

      setOpen(true);
    } catch (err) {
      console.error("게시글 상세 정보를 불러오는 중 오류가 발생했습니다:", err);
      // 에러가 발생해도 모달은 열지만 상세 정보 조회에 실패했다는 메시지 표시 가능
      setSelectedArticle(article);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  // 로딩 중일 때 표시할 컴포넌트
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 에러가 있을 때 표시할 컴포넌트
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: isMobile ? 2 : 3, mb: isMobile ? 4 : 5, px: isMobile ? 1 : 2 }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            mb: 1,
            fontSize: { xs: "1.3rem", sm: "1.6rem" },
            mt: 0,
            fontWeight: 700,
            letterSpacing: "0.05em",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            fontFamily: "'Montserrat', 'Roboto', sans-serif",
            position: "relative",
            display: "inline-block",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "-3px",
              left: "50%",
              width: "40%",
              height: "2px",
              background:
                "linear-gradient(to right, transparent, rgba(25, 118, 210, 0.7), transparent)",
              transform: "translateX(-50%)",
              animation: "pulse 2s infinite ease-in-out",
            },
            "@keyframes pulse": {
              "0%": { opacity: 0.6 },
              "50%": { opacity: 1 },
              "100%": { opacity: 0.6 },
            },
          }}
        >
          Oh My Hea!th Articles
        </Typography>
      </Box>

      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: isMobile ? 1 : 2,
        }}
      >
        <TableContainer sx={{ maxHeight: isMobile ? 400 : 440 }}>
          <Table
            stickyHeader
            aria-label="sticky table"
            size={isMobile ? "small" : "medium"}
          >
            <TableHead>
              <TableRow>
                {columns.map((column) =>
                  !isMobile || !column.hideOnMobile ? (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth:
                          isMobile && column.mobileWidth
                            ? column.mobileWidth
                            : column.minWidth,
                        padding: isMobile ? "8px 4px" : undefined,
                        fontSize: isMobile ? "0.7rem" : undefined,
                      }}
                      sortDirection={orderBy === column.id ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : "asc"}
                        onClick={() => handleRequestSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    </TableCell>
                  ) : null
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {articles.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      columns.filter((col) => !isMobile || !col.hideOnMobile)
                        .length
                    }
                    align="center"
                  >
                    게시글이 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                stableSort<ArticleType>(articles, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((article) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={String(article.id)}
                        onClick={() => handleOpen(article)}
                        sx={{
                          cursor: "pointer",
                          height: isMobile ? "50px" : "64px",
                        }}
                      >
                        {columns.map((column) => {
                          const value = article[column.id];
                          return !isMobile || !column.hideOnMobile ? (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              sx={{
                                padding: isMobile ? "8px 4px" : undefined,
                                fontSize: isMobile ? "0.7rem" : undefined,
                                width:
                                  isMobile && column.mobileWidth
                                    ? column.mobileWidth
                                    : undefined,
                                ...(column.id === "title" && {
                                  maxWidth: isMobile ? "190px" : "320px",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }),
                              }}
                            >
                              {column.format &&
                              (typeof value === "number" ||
                                typeof value === "string")
                                ? column.format(value)
                                : typeof value === "string"
                                ? value
                                : String(value)}
                            </TableCell>
                          ) : null;
                        })}
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 25]}
          component="div"
          count={articles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={isMobile ? "행 수:" : "페이지당 행:"}
          labelDisplayedRows={({ from, to, count }) =>
            isMobile
              ? `${from}-${to}/${count}`
              : `${from}-${to} / 전체 ${count}`
          }
          sx={{
            ".MuiTablePagination-selectLabel": {
              fontSize: isMobile ? "0.75rem" : undefined,
            },
            ".MuiTablePagination-select": {
              fontSize: isMobile ? "0.75rem" : undefined,
            },
            ".MuiTablePagination-displayedRows": {
              fontSize: isMobile ? "0.75rem" : undefined,
            },
            ".MuiTablePagination-actions": {
              marginLeft: isMobile ? 1 : undefined,
            },
          }}
        />
      </Paper>

      {/* 아티클 상세 모달 */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: isMobile ? "92%" : 600,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: isMobile ? "16px 12px" : 4,
              borderRadius: isMobile ? 1 : 2,
              maxHeight: isMobile ? "85vh" : "80vh",
              overflow: "auto",
            }}
          >
            {selectedArticle && (
              <Card sx={{ boxShadow: "none" }}>
                <CardContent sx={{ p: isMobile ? 1 : 2 }}>
                  <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    component="h2"
                    sx={{ fontWeight: 600, lineHeight: 1.4 }}
                  >
                    {selectedArticle.title}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      justifyContent: "space-between",
                      alignItems: isMobile ? "flex-start" : "center",
                      mt: 1,
                      mb: 2,
                      gap: isMobile ? 0.5 : 0,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: isMobile ? "0.75rem" : undefined }}
                    >
                      {selectedArticle.category}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: isMobile ? "0.75rem" : undefined }}
                    >
                      {new Date(selectedArticle.date).toLocaleDateString(
                        "ko-KR"
                      )}{" "}
                      | 조회 {selectedArticle.views.toLocaleString("ko-KR")}
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: "pre-line",
                      fontSize: isMobile ? "0.9rem" : undefined,
                      lineHeight: 1.7,
                    }}
                  >
                    {selectedArticle.content}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
};

export default Article;
