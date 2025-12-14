import AuthRepository from "@/repositories/AuthRepository";
import { login, useEmployee } from "@/store/features/employee";
import { IQuestion } from "@/utils/interfaces/Question";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  TextField,
  Typography,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AiFillSave } from "react-icons/ai";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import store from "@/store";
import ToastHelper from "@/utils/helpers/ToastHelper";

interface IAnswer {
  isClear: boolean;
  questionId: number;
  description: string | null;
}

const QuestionsPage = () => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [descriptions, setDescriptions] = useState<{ [key: number]: string }>(
    {}
  );
  const [error, setError] = useState<string>("");

  const { employee, machine, workOrder } = useEmployee();
  const navigate = useNavigate();

  if (!employee || !machine || !workOrder) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data: results } = (
        await AuthRepository.getHygenieQuestions(
          parseInt(machine?.machineCode ?? "0")
        )
      ).data;

      setQuestions(results);
    };

    fetchQuestions();
  }, [machine]);

  const handleAnswer = (questionId: number, isClear: boolean) => {
    const existingAnswerIndex = answers.findIndex(
      (answer) => answer.questionId === questionId
    );

    if (existingAnswerIndex !== -1) {
      const newAnswers = [...answers];
      newAnswers[existingAnswerIndex] = {
        isClear,
        questionId,
        description: isClear ? null : descriptions[questionId] || "",
      };
      setAnswers(newAnswers);
    } else {
      setAnswers([
        ...answers,
        {
          isClear,
          questionId,
          description: isClear ? null : descriptions[questionId] || "",
        },
      ]);
    }
  };

  const handleDescriptionChange = (questionId: number, value: string) => {
    setDescriptions((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    const existingAnswerIndex = answers.findIndex(
      (answer) => answer.questionId === questionId
    );

    if (existingAnswerIndex !== -1) {
      const newAnswers = [...answers];
      newAnswers[existingAnswerIndex] = {
        ...newAnswers[existingAnswerIndex],
        description: value,
      };
      setAnswers(newAnswers);
    }
  };

  const handleSubmit = async () => {
    // Hayır cevaplarının açıklamalarını kontrol et
    const emptyDescriptions = answers
      .filter((answer) => !answer.isClear)
      .filter(
        (answer) => !answer.description || answer.description.trim() === ""
      );

    if (emptyDescriptions.length > 0) {
      setError(
        "Lütfen 'Hayır' cevabı verdiğiniz sorular için açıklama giriniz."
      );
      ToastHelper.error(
        "Lütfen 'Hayır' cevabı verdiğiniz sorular için açıklama giriniz."
      );
      return;
    }

    setError("");

    const response = (
      await AuthRepository.sendQuestionsAnwers({
        machine: parseInt(machine.machineCode),
        staff: parseInt(employee.staffCode),
        hygiene: answers.map((answer) => ({
          clear: answer.isClear ? 1 : 0,
          desc: answer.description,
          question: answer.questionId,
        })),
      })
    ).data;

    if (response.success) {
      store.dispatch(login());
      navigate("/");
    }
  };

  const isAllQuestionsAnswered = () => {
    return questions.every((question) =>
      answers.some((answer) => answer.questionId === question.soruId)
    );
  };

  const isDescriptionRequired = (questionId: number) => {
    const answer = answers.find((a) => a.questionId === questionId);
    return answer && !answer.isClear;
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03),
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Card
          elevation={4}
          sx={{
            borderRadius: 3,
            overflow: "visible",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: -5,
              left: -5,
              right: -5,
              bottom: -5,
              border: "2px solid",
              borderColor: "primary.main",
              borderRadius: 4,
              opacity: 0.1,
            },
          }}
        >
          <CardHeader
            title={
              <Typography
                variant="h4"
                fontWeight={600}
                color="primary.main"
                textAlign="center"
              >
                Kontrol Listesi
              </Typography>
            }
            sx={{ pb: 1, pt: 3 }}
          />
          <CardContent sx={{ p: 4 }}>
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      width="60%"
                      sx={{ fontSize: "1.2rem", fontWeight: "bold", py: 2 }}
                    >
                      Soru
                    </TableCell>
                    <TableCell
                      width="20%"
                      sx={{ fontSize: "1.2rem", fontWeight: "bold", py: 2 }}
                    >
                      Durum
                    </TableCell>
                    <TableCell
                      width="20%"
                      sx={{ fontSize: "1.2rem", fontWeight: "bold", py: 2 }}
                    >
                      Açıklama
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map((question) => (
                    <TableRow key={question.soruId}>
                      <TableCell sx={{ fontSize: "1rem", py: 1.5 }}>
                        {question.soru}
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Button
                            variant={
                              answers.find(
                                (a) =>
                                  a.questionId === question.soruId && a.isClear
                              )
                                ? "contained"
                                : "outlined"
                            }
                            color="success"
                            size="large"
                            onClick={() => handleAnswer(question.soruId, true)}
                            startIcon={<IoCheckmarkCircle size={24} />}
                            sx={{
                              fontSize: "1rem",
                              px: 3,
                              py: 1,
                              minWidth: "120px",
                              borderRadius: 2,
                              textTransform: "none",
                              boxShadow: answers.find(
                                (a) =>
                                  a.questionId === question.soruId && a.isClear
                              )
                                ? "0 4px 12px rgba(46, 125, 50, 0.2)"
                                : "none",
                              "&:hover": {
                                boxShadow: "0 6px 16px rgba(46, 125, 50, 0.3)",
                              },
                            }}
                          >
                            EVET
                          </Button>
                          <Button
                            variant={
                              answers.find(
                                (a) =>
                                  a.questionId === question.soruId && !a.isClear
                              )
                                ? "contained"
                                : "outlined"
                            }
                            color="error"
                            size="large"
                            onClick={() => handleAnswer(question.soruId, false)}
                            startIcon={<IoCloseCircle size={24} />}
                            sx={{
                              fontSize: "1rem",
                              px: 3,
                              py: 1,
                              minWidth: "120px",
                              borderRadius: 2,
                              textTransform: "none",
                              boxShadow: answers.find(
                                (a) =>
                                  a.questionId === question.soruId && !a.isClear
                              )
                                ? "0 4px 12px rgba(211, 47, 47, 0.2)"
                                : "none",
                              "&:hover": {
                                boxShadow: "0 6px 16px rgba(211, 47, 47, 0.3)",
                              },
                            }}
                          >
                            HAYIR
                          </Button>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        {isDescriptionRequired(question.soruId) && (
                          <TextField
                            value={descriptions[question.soruId] || ""}
                            onChange={(e) =>
                              handleDescriptionChange(
                                question.soruId,
                                e.target.value
                              )
                            }
                            placeholder="Açıklama giriniz"
                            fullWidth
                            size="medium"
                            required
                            multiline
                            rows={2}
                            error={
                              isDescriptionRequired(question.soruId) &&
                              !descriptions[question.soruId]
                            }
                            helperText={
                              isDescriptionRequired(question.soruId) &&
                              !descriptions[question.soruId]
                                ? "Açıklama zorunludur"
                                : ""
                            }
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                fontSize: "1rem",
                                borderRadius: 2,
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "error.main",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderWidth: 2,
                                  },
                              },
                              "& .MuiFormHelperText-root": {
                                fontSize: "0.9rem",
                              },
                            }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {error && (
              <Typography color="error" textAlign="center" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                startIcon={<AiFillSave size={24} />}
                variant="contained"
                size="large"
                color="success"
                onClick={handleSubmit}
                disabled={!isAllQuestionsAnswered()}
                sx={{
                  height: 52,
                  px: 5,
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  fontWeight: "medium",
                  textTransform: "none",
                  boxShadow: "0 4px 12px rgba(46, 125, 50, 0.2)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(46, 125, 50, 0.3)",
                  },
                }}
              >
                Kaydet ve Bitir
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default QuestionsPage;
