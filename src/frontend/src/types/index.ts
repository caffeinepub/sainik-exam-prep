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
  | "admin"
  | "pricing"
  | "payment-success"
  | "payment-failure"
  | "poster";

export type { ExamCategory, Subject } from "../hooks/useQueries";
