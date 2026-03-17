import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PracticeQuestion {
    id: bigint;
    topic: string;
    question: string;
    subject: Subject;
    explanation: string;
    correctAnswer: bigint;
    examCategory: ExamCategory;
    options: Array<string>;
}
export interface MockTest {
    id: bigint;
    title: string;
    examCategory: ExamCategory;
    durationMinutes: bigint;
    questionIds: Array<bigint>;
}
export interface LeaderboardEntry {
    principal: Principal;
    total: bigint;
    scorePercentage: bigint;
    timestamp: bigint;
    testTitle: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface StudyNoteInput {
    topic: string;
    content: string;
    subject: Subject;
    examCategory: ExamCategory;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TestSubmissionResult {
    total: bigint;
    score: bigint;
    timeTaken: bigint;
    percentage: bigint;
}
export interface TestAttempt {
    principal: Principal;
    total: bigint;
    answers: Array<bigint>;
    score: bigint;
    timestamp: bigint;
    timeTaken: bigint;
    testId: bigint;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface QuestionInput {
    topic: string;
    question: string;
    subject: Subject;
    explanation: string;
    correctAnswer: bigint;
    examCategory: ExamCategory;
    options: Array<string>;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
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
    addQuestion(questionInput: QuestionInput): Promise<void>;
    addStudyNote(noteInput: StudyNoteInput): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    claimFirstAdmin(): Promise<void>;
    clearRazorpayKeyId(): Promise<void>;
    clearStripeConfiguration(): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
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
    getPracticeQuestions(cat: ExamCategory, subj: Subject): Promise<Array<PracticeQuestion>>;
    getQuestionsByCategoryAndSubject(cat: ExamCategory, subj: Subject): Promise<Array<Question>>;
    getRazorpayKeyId(): Promise<string | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserAttempts(): Promise<Array<TestAttempt>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isRazorpayConfigured(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setRazorpayKeyId(key: string): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitTestAttempt(testId: bigint, answers: Array<bigint>, timeTaken: bigint): Promise<TestSubmissionResult>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
