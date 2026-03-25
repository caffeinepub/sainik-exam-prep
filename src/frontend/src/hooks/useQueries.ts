import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExamCategory, Subject } from "../backend.d";
import type { UserProfile } from "../backend.d";
import { useActor } from "./useActor";

export function usePracticeQuestions(
  cat: ExamCategory,
  subj: Subject,
  enabled = true,
) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["practice", cat, subj],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPracticeQuestions(cat, subj);
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useQuestionsByCategoryAndSubject(
  cat: ExamCategory,
  subj: Subject,
  enabled = true,
) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["questions", cat, subj],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuestionsByCategoryAndSubject(cat, subj);
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useMockTestsByCategory(cat: ExamCategory) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["mockTests", cat],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMockTestsByCategory(cat);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMockTestById(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["mockTest", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getMockTestById(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useStudyNotes(cat: ExamCategory, subj: Subject) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["notes", cat, subj],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotesByCategoryAndSubject(cat, subj);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLeaderboard(cat: ExamCategory) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["leaderboard", cat],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboardByCategory(cat);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserAttempts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userAttempts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserAttempts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitTestAttempt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      testId,
      answers,
      timeTaken,
    }: {
      testId: bigint;
      answers: bigint[];
      timeTaken: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitTestAttempt(testId, answers, timeTaken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAttempts"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useAddQuestion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      examCategory: ExamCategory;
      subject: Subject;
      topic: string;
      question: string;
      options: string[];
      correctAnswer: bigint;
      explanation: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addQuestion({
        examCategory: params.examCategory,
        subject: params.subject,
        topic: params.topic,
        question: params.question,
        options: params.options,
        correctAnswer: params.correctAnswer,
        explanation: params.explanation,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["practice"] });
    },
  });
}

export function useCreateMockTest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      examCategory: ExamCategory;
      questionIds: bigint[];
      durationMinutes: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createMockTest(
        params.title,
        params.examCategory,
        params.questionIds,
        params.durationMinutes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mockTests"] });
    },
  });
}

export function useAddStudyNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      examCategory: ExamCategory;
      subject: Subject;
      topic: string;
      content: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addStudyNote({
        examCategory: params.examCategory,
        subject: params.subject,
        topic: params.topic,
        content: params.content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useInitializeAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (adminToken: string) => {
      if (!actor) throw new Error("Not connected");
      return actor._initializeAccessControlWithSecret(adminToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}

export function useClaimFirstAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.claimFirstAdmin();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}

export function useClaimAdminWithCode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.claimAdminWithCode(code);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isStripeConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (config: {
      secretKey: string;
      allowedCountries: string[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isStripeConfigured"] });
    },
  });
}

export function useClearStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.clearStripeConfiguration();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isStripeConfigured"] });
    },
  });
}

export { ExamCategory, Subject };
