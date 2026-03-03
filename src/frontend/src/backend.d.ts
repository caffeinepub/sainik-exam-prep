import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TestAttempt {
    principal: Principal;
    total: bigint;
    answers: Array<bigint>;
    score: bigint;
    timestamp: bigint;
    timeTaken: bigint;
    testId: bigint;
}
export interface LeaderboardEntry {
    principal: Principal;
    total: bigint;
    scorePercentage: bigint;
    timestamp: bigint;
    testTitle: string;
}
export interface Question {
    id: bigint;
    topic: string;
    question: string;
    subject: Subject;
    explanation: string;
    correctAnswer: bigint;
    examCategory: ExamCategory;
    options: Array<string>;
}
export interface StudyNote {
    id: bigint;
    topic: string;
    content: string;
    subject: Subject;
    examCategory: ExamCategory;
}
export interface UserProfile {
    name: string;
    examCategory?: ExamCategory;
}
export interface MockTest {
    id: bigint;
    title: string;
    examCategory: ExamCategory;
    durationMinutes: bigint;
    questionIds: Array<bigint>;
}
export enum ExamCategory {
    rms = "rms",
    sainikSchool = "sainikSchool",
    rimc = "rimc",
    navodaya = "navodaya"
}
export enum Subject {
    gk = "gk",
    math = "math",
    reasoning = "reasoning",
    english = "english"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addQuestion(examCategory: ExamCategory, subject: Subject, topic: string, question: string, options: Array<string>, correctAnswer: bigint, explanation: string): Promise<void>;
    addStudyNote(examCategory: ExamCategory, subject: Subject, topic: string, content: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createMockTest(title: string, examCategory: ExamCategory, questionIds: Array<bigint>, durationMinutes: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLeaderboardByCategory(cat: ExamCategory): Promise<Array<LeaderboardEntry>>;
    getMockTestById(id: bigint): Promise<{
        test: MockTest;
        questions: Array<Question>;
    }>;
    getMockTestsByCategory(cat: ExamCategory): Promise<Array<MockTest>>;
    getNotesByCategoryAndSubject(cat: ExamCategory, subj: Subject): Promise<Array<StudyNote>>;
    getPracticeQuestions(cat: ExamCategory, subj: Subject): Promise<Array<Question>>;
    getQuestionsByCategoryAndSubject(cat: ExamCategory, subj: Subject): Promise<Array<Question>>;
    getUserAttempts(): Promise<Array<TestAttempt>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitTestAttempt(testId: bigint, answers: Array<bigint>, timeTaken: bigint): Promise<{
        total: bigint;
        score: bigint;
    }>;
}
