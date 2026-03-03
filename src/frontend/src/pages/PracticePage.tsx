import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  RotateCcw,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import type { Question } from "../backend.d";
import {
  ExamCategory,
  Subject,
  usePracticeQuestions,
} from "../hooks/useQueries";
import type { Page } from "../types";
import { EXAM_INFO, SUBJECT_INFO } from "../utils/examInfo";

interface PracticePageProps {
  initialCategory?: ExamCategory;
  initialSubject?: Subject;
  onNavigate: (page: Page) => void;
}

type AnswerState = "unanswered" | "correct" | "wrong";

interface QuizState {
  currentIndex: number;
  answers: Record<number, number>;
  answerStates: Record<number, AnswerState>;
  showExplanation: boolean;
  completed: boolean;
}

function QuestionCard({
  question,
  qIndex,
  totalQuestions,
  state,
  onAnswer,
  onNext,
  onPrev,
}: {
  question: Question;
  qIndex: number;
  totalQuestions: number;
  state: QuizState;
  onAnswer: (optionIndex: number) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const userAnswer = state.answers[qIndex];
  const answerState = state.answerStates[qIndex] || "unanswered";
  const correctIdx = Number(question.correctAnswer);

  const getOptionClass = (idx: number) => {
    if (answerState === "unanswered") {
      return "border-border bg-card hover:border-navy-400 hover:bg-secondary/50 cursor-pointer";
    }
    if (idx === correctIdx)
      return "border-india-green bg-emerald-50 cursor-default";
    if (idx === userAnswer && answerState === "wrong")
      return "border-destructive bg-red-50 cursor-default";
    return "border-border bg-card opacity-60 cursor-default";
  };

  return (
    <motion.div
      key={qIndex}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
    >
      {/* Progress bar */}
      <div className="px-6 pt-5 pb-0">
        <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
          <span className="font-medium">
            Question {qIndex + 1} of {totalQuestions}
          </span>
          <span className="font-medium">
            {Math.round(((qIndex + 1) / totalQuestions) * 100)}%
          </span>
        </div>
        <Progress
          value={((qIndex + 1) / totalQuestions) * 100}
          className="h-2"
        />
        <Badge variant="outline" className="mt-3 text-xs">
          {question.topic}
        </Badge>
      </div>

      {/* Question */}
      <div className="px-6 py-5">
        <p className="font-display text-lg font-semibold text-foreground leading-relaxed mb-6">
          {question.question}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              type="button"
              // biome-ignore lint/suspicious/noArrayIndexKey: options are positional
              key={idx}
              data-ocid={`practice.option.${idx + 1}`}
              onClick={() => answerState === "unanswered" && onAnswer(idx)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${getOptionClass(idx)}`}
            >
              <span
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                  answerState !== "unanswered" && idx === correctIdx
                    ? "bg-india-green border-india-green text-white"
                    : answerState !== "unanswered" &&
                        idx === userAnswer &&
                        answerState === "wrong"
                      ? "bg-destructive border-destructive text-white"
                      : "border-border text-muted-foreground"
                }`}
              >
                {String.fromCharCode(65 + idx)}
              </span>
              <span
                className={`text-sm font-medium ${
                  answerState !== "unanswered" && idx === correctIdx
                    ? "text-emerald-800"
                    : answerState !== "unanswered" &&
                        idx === userAnswer &&
                        answerState === "wrong"
                      ? "text-red-800"
                      : "text-foreground"
                }`}
              >
                {option}
              </span>
              {answerState !== "unanswered" && idx === correctIdx && (
                <CheckCircle2 className="w-5 h-5 text-india-green ml-auto flex-shrink-0" />
              )}
              {answerState !== "unanswered" &&
                idx === userAnswer &&
                answerState === "wrong" && (
                  <XCircle className="w-5 h-5 text-destructive ml-auto flex-shrink-0" />
                )}
            </button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {answerState !== "unanswered" &&
          state.showExplanation &&
          question.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border mx-6 mb-0"
            >
              <div className="py-4 flex gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-700 mb-1">
                    Explanation
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-between">
        <Button
          data-ocid="practice.prev_button"
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={qIndex === 0}
          className="flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {answerState !== "unanswered" && (
            <div
              className={`flex items-center gap-1.5 text-sm font-semibold ${
                answerState === "correct"
                  ? "text-india-green"
                  : "text-destructive"
              }`}
            >
              {answerState === "correct" ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Correct!
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" /> Wrong
                </>
              )}
            </div>
          )}
        </div>

        {qIndex === totalQuestions - 1 ? (
          <Button
            data-ocid="practice.submit_button"
            size="sm"
            className="bg-saffron-400 hover:bg-saffron-500 text-navy-900 font-bold border-0"
            onClick={onNext}
          >
            <Trophy className="w-4 h-4 mr-1.5" />
            Finish
          </Button>
        ) : (
          <Button
            data-ocid="practice.next_button"
            size="sm"
            onClick={onNext}
            className="flex items-center gap-1.5"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export function PracticePage({
  initialCategory,
  initialSubject,
  onNavigate: _onNavigate,
}: PracticePageProps) {
  const [category, setCategory] = useState<ExamCategory>(
    initialCategory || ExamCategory.rimc,
  );
  const [subject, setSubject] = useState<Subject>(
    initialSubject || Subject.math,
  );
  const [started, setStarted] = useState(false);

  const [quizState, setQuizState] = useState<QuizState>({
    currentIndex: 0,
    answers: {},
    answerStates: {},
    showExplanation: true,
    completed: false,
  });

  const {
    data: questions = [],
    isLoading,
    refetch,
  } = usePracticeQuestions(category, subject, started);

  const handleAnswer = useCallback(
    (optionIdx: number) => {
      const q = questions[quizState.currentIndex];
      const correct = Number(q.correctAnswer) === optionIdx;
      setQuizState((prev) => ({
        ...prev,
        answers: { ...prev.answers, [prev.currentIndex]: optionIdx },
        answerStates: {
          ...prev.answerStates,
          [prev.currentIndex]: correct ? "correct" : "wrong",
        },
      }));
    },
    [questions, quizState.currentIndex],
  );

  const handleNext = useCallback(() => {
    setQuizState((prev) => {
      if (prev.currentIndex === questions.length - 1) {
        return { ...prev, completed: true };
      }
      return { ...prev, currentIndex: prev.currentIndex + 1 };
    });
  }, [questions.length]);

  const handlePrev = useCallback(() => {
    setQuizState((prev) => ({
      ...prev,
      currentIndex: Math.max(0, prev.currentIndex - 1),
    }));
  }, []);

  const handleRetry = () => {
    setQuizState({
      currentIndex: 0,
      answers: {},
      answerStates: {},
      showExplanation: true,
      completed: false,
    });
    refetch();
  };

  const handleStart = () => {
    setStarted(true);
    setQuizState({
      currentIndex: 0,
      answers: {},
      answerStates: {},
      showExplanation: true,
      completed: false,
    });
  };

  const correctCount = Object.values(quizState.answerStates).filter(
    (s) => s === "correct",
  ).length;
  const totalAnswered = Object.keys(quizState.answerStates).length;
  const scorePercent =
    questions.length > 0
      ? Math.round((correctCount / questions.length) * 100)
      : 0;

  // Selection screen
  if (!started) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-blue-700" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Practice Mode
            </h1>
            <p className="text-muted-foreground">
              Select exam category and subject to begin practicing
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border shadow-card p-8 space-y-6"
          >
            <div>
              <p className="block text-sm font-semibold text-foreground mb-2">
                Exam Category
              </p>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as ExamCategory)}
              >
                <SelectTrigger
                  data-ocid="practice.category_select"
                  className="h-12"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ExamCategory).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {EXAM_INFO[cat].icon} {EXAM_INFO[cat].fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="block text-sm font-semibold text-foreground mb-2">
                Subject
              </p>
              <Select
                value={subject}
                onValueChange={(v) => setSubject(v as Subject)}
              >
                <SelectTrigger
                  data-ocid="practice.subject_select"
                  className="h-12"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Subject).map((subj) => (
                    <SelectItem key={subj} value={subj}>
                      {SUBJECT_INFO[subj].icon} {SUBJECT_INFO[subj].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-secondary/60 rounded-xl">
              <p className="text-sm font-semibold text-foreground mb-1">
                {EXAM_INFO[category].name} — {SUBJECT_INFO[subject].name}
              </p>
              <p className="text-xs text-muted-foreground">
                {SUBJECT_INFO[subject].description}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Up to 10 practice questions will be loaded
              </p>
            </div>

            <Button
              data-ocid="practice.start_button"
              onClick={handleStart}
              size="lg"
              className="w-full bg-navy-800 hover:bg-saffron-400 hover:text-navy-900 text-white font-bold transition-all duration-300 border-0 h-12"
            >
              <Target className="w-5 h-5 mr-2" />
              Start Practice Session
            </Button>
          </motion.div>
        </div>
      </main>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div data-ocid="practice.loading_state" className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  // Empty state
  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div
            data-ocid="practice.empty_state"
            className="bg-card rounded-2xl border border-border p-12"
          >
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              No Questions Yet
            </h2>
            <p className="text-muted-foreground mb-6">
              No questions available for {EXAM_INFO[category].name} —{" "}
              {SUBJECT_INFO[subject].name} yet. Try a different combination!
            </p>
            <Button onClick={() => setStarted(false)} variant="outline">
              Change Selection
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Score summary
  if (quizState.completed) {
    const grade =
      scorePercent >= 80
        ? "Excellent!"
        : scorePercent >= 60
          ? "Good Job!"
          : scorePercent >= 40
            ? "Keep Practicing!"
            : "Needs More Work";

    return (
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
          >
            <div
              className={`p-8 text-center ${scorePercent >= 60 ? "bg-emerald-50" : "bg-red-50"}`}
            >
              <div className="text-6xl mb-4">
                {scorePercent >= 80
                  ? "🏆"
                  : scorePercent >= 60
                    ? "🎯"
                    : scorePercent >= 40
                      ? "📚"
                      : "💪"}
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                {grade}
              </h2>
              <div className="text-5xl font-display font-bold text-foreground">
                {scorePercent}
                <span className="text-2xl text-muted-foreground">%</span>
              </div>
              <p className="text-muted-foreground mt-2">
                {correctCount} correct out of {questions.length} questions
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-emerald-50 rounded-xl">
                  <p className="text-2xl font-bold text-india-green">
                    {correctCount}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    Correct
                  </p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-xl">
                  <p className="text-2xl font-bold text-red-500">
                    {totalAnswered - correctCount}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    Wrong
                  </p>
                </div>
                <div className="text-center p-3 bg-secondary rounded-xl">
                  <p className="text-2xl font-bold text-foreground">
                    {questions.length - totalAnswered}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    Skipped
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button
                  onClick={() => setStarted(false)}
                  className="flex-1 gap-2 bg-navy-800 hover:bg-navy-700 text-white border-0"
                >
                  <BookOpen className="w-4 h-4" />
                  New Practice
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  // Quiz
  const currentQ = questions[quizState.currentIndex];

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => setStarted(false)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Exit Practice
          </button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {EXAM_INFO[category].name}
            </Badge>
            <Badge className={`${SUBJECT_INFO[subject].color} text-xs`}>
              {SUBJECT_INFO[subject].name}
            </Badge>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <QuestionCard
            question={currentQ}
            qIndex={quizState.currentIndex}
            totalQuestions={questions.length}
            state={quizState}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </AnimatePresence>

        {/* Question dots */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {questions.map((_, idx) => (
            <button
              type="button"
              // biome-ignore lint/suspicious/noArrayIndexKey: questions are positional
              key={idx}
              onClick={() =>
                setQuizState((prev) => ({ ...prev, currentIndex: idx }))
              }
              className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${
                idx === quizState.currentIndex
                  ? "bg-navy-800 text-white scale-110"
                  : quizState.answerStates[idx] === "correct"
                    ? "bg-india-green text-white"
                    : quizState.answerStates[idx] === "wrong"
                      ? "bg-destructive text-white"
                      : "bg-secondary text-muted-foreground"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
