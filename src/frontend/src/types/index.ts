export type Page =
  | "home"
  | "dashboard"
  | "practice"
  | "mock-tests"
  | "mock-test-active"
  | "mock-test-result"
  | "notes"
  | "leaderboard"
  | "progress"
  | "admin";

export type { ExamCategory, Subject } from "../hooks/useQueries";
