import { ExamCategory, Subject } from "../hooks/useQueries";

export const EXAM_INFO = {
  [ExamCategory.rimc]: {
    name: "RIMC",
    fullName: "Rashtriya Indian Military College",
    description:
      "Premier military prep school in Dehradun for boys aged 11½–13 years aspiring to join the armed forces.",
    color: "from-navy-800 to-navy-900",
    accentColor: "bg-saffron-400",
    icon: "🦁",
    age: "11½–13 years",
    location: "Dehradun, Uttarakhand",
    seats: "25 boys per batch",
    subjects: ["Mathematics", "English", "General Knowledge"],
  },
  [ExamCategory.sainikSchool]: {
    name: "Sainik School",
    fullName: "Sainik School",
    description:
      "National network of military schools for boys aged 10–12 (Class VI) preparing future defense officers.",
    color: "from-india-green to-emerald-800",
    accentColor: "bg-india-saffron",
    icon: "⚔️",
    age: "10–12 years",
    location: "Pan-India (33 schools)",
    seats: "Varies by school",
    subjects: ["Mathematics", "English", "Intelligence Test"],
  },
  [ExamCategory.rms]: {
    name: "RMS",
    fullName: "Rashtriya Military School",
    description:
      "Elite military schools for boys aged 10–12 years with 5 campuses across India under Ministry of Defence.",
    color: "from-amber-700 to-amber-900",
    accentColor: "bg-india-green",
    icon: "🎖️",
    age: "10–12 years",
    location: "Ajmer, Bangalore, Belgaum, Dholpur, Chail",
    seats: "Limited seats",
    subjects: ["Mathematics", "English", "General Knowledge"],
  },
  [ExamCategory.navodaya]: {
    name: "Navodaya",
    fullName: "Jawahar Navodaya Vidyalaya",
    description:
      "Residential schools for talented rural students from Class VI–XII across India, free education.",
    color: "from-violet-700 to-violet-900",
    accentColor: "bg-saffron-300",
    icon: "📚",
    age: "9–13 years",
    location: "Pan-India (660+ schools)",
    seats: "80 per school",
    subjects: ["Mental Ability", "Arithmetic", "Language"],
  },
};

export const SUBJECT_INFO = {
  [Subject.math]: {
    name: "Mathematics",
    icon: "📐",
    color: "bg-blue-100 text-blue-800",
    description: "Arithmetic, Algebra, Geometry, Mensuration",
  },
  [Subject.english]: {
    name: "English",
    icon: "📝",
    color: "bg-purple-100 text-purple-800",
    description: "Grammar, Comprehension, Vocabulary, Writing",
  },
  [Subject.gk]: {
    name: "General Knowledge",
    icon: "🌍",
    color: "bg-green-100 text-green-800",
    description: "Current Affairs, History, Geography, Science",
  },
  [Subject.reasoning]: {
    name: "Reasoning",
    icon: "🧩",
    color: "bg-orange-100 text-orange-800",
    description: "Logical Reasoning, Pattern Recognition, Puzzles",
  },
};

export function formatPrincipal(principal: string): string {
  if (!principal || principal.length < 10) return principal;
  return `${principal.slice(0, 6)}...${principal.slice(-4)}`;
}

export function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export function getScoreColor(percentage: number): string {
  if (percentage >= 80) return "text-india-green";
  if (percentage >= 60) return "text-saffron-500";
  if (percentage >= 40) return "text-yellow-600";
  return "text-red-600";
}

export function getGrade(percentage: number): string {
  if (percentage >= 90) return "Excellent";
  if (percentage >= 80) return "Very Good";
  if (percentage >= 70) return "Good";
  if (percentage >= 60) return "Above Average";
  if (percentage >= 50) return "Average";
  if (percentage >= 40) return "Below Average";
  return "Needs Improvement";
}
