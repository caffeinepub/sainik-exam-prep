import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  ClipboardList,
  Clock,
  Crown,
  FileText,
  MapPin,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import {
  type ExamCategory,
  Subject,
  useUserAttempts,
} from "../hooks/useQueries";
import type { Page } from "../types";
import { EXAM_INFO, SUBJECT_INFO } from "../utils/examInfo";

interface DashboardPageProps {
  category: ExamCategory;
  onNavigate: (page: Page) => void;
  onSelectSubject: (subj: Subject) => void;
}

export function DashboardPage({
  category,
  onNavigate,
  onSelectSubject,
}: DashboardPageProps) {
  const examInfo = EXAM_INFO[category];
  const { data: attempts = [] } = useUserAttempts();

  const recentAttempts = [...attempts]
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .slice(0, 3);

  const avgScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce(
            (sum, a) => sum + (Number(a.score) / Number(a.total)) * 100,
            0,
          ) / attempts.length,
        )
      : null;

  const SUBJECTS = [
    Subject.math,
    Subject.english,
    Subject.gk,
    Subject.reasoning,
  ];

  const ACTIONS = [
    {
      page: "practice" as Page,
      icon: BookOpen,
      label: "Practice Questions",
      desc: "Topic-wise practice",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      page: "mock-tests" as Page,
      icon: ClipboardList,
      label: "Mock Tests",
      desc: "Full-length timed exams",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      page: "notes" as Page,
      icon: FileText,
      label: "Study Notes",
      desc: "Chapter-wise notes",
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  return (
    <main className="min-h-screen bg-background pb-12">
      {/* Header */}
      <div className="bg-military border-b border-navy-700/50">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 text-navy-300 hover:text-white text-sm font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{examInfo.icon}</span>
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
                    {examInfo.fullName}
                  </h1>
                  <p className="text-navy-300 text-sm">
                    {examInfo.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                <Badge className="bg-white/10 text-navy-100 border-white/20 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {examInfo.location}
                </Badge>
                <Badge className="bg-white/10 text-navy-100 border-white/20 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Age: {examInfo.age}
                </Badge>
                {avgScore !== null && (
                  <Badge className="bg-saffron-400/20 text-saffron-300 border-saffron-400/30 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Avg Score: {avgScore}%
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Subjects */}
            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-saffron-400 rounded-full inline-block" />
                Practice by Subject
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SUBJECTS.map((subj, idx) => {
                  const info = SUBJECT_INFO[subj];
                  return (
                    <motion.div
                      key={subj}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="bg-card rounded-xl border border-border p-5 hover:shadow-card transition-shadow group cursor-pointer"
                      onClick={() => {
                        onSelectSubject(subj);
                        onNavigate("practice");
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-3xl">{info.icon}</div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-saffron-500 transition-colors" />
                      </div>
                      <h3 className="font-display font-bold text-foreground mb-1">
                        {info.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {info.description}
                      </p>
                      <div className="mt-3 flex gap-2">
                        {ACTIONS.slice(0, 3).map(
                          ({ page, icon: Icon, label }) => (
                            <button
                              type="button"
                              key={page}
                              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-saffron-600 font-medium transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectSubject(subj);
                                onNavigate(page);
                              }}
                            >
                              <Icon className="w-3 h-3" />
                              {label.split(" ")[0]}
                            </button>
                          ),
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Quick Actions */}
            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-india-green rounded-full inline-block" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {ACTIONS.map(({ page, icon: Icon, label, desc, color }) => (
                  <button
                    type="button"
                    key={page}
                    onClick={() => onNavigate(page)}
                    className={`flex flex-col items-start p-4 rounded-xl border ${color} hover:shadow-md transition-all duration-200 text-left group`}
                  >
                    <Icon className="w-6 h-6 mb-3" />
                    <span className="font-display font-bold text-sm mb-0.5">
                      {label}
                    </span>
                    <span className="text-xs opacity-80">{desc}</span>
                    <ChevronRight className="w-4 h-4 mt-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Exam Info Card */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-display font-bold text-foreground mb-4 text-lg">
                Exam Overview
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Age Criteria
                  </p>
                  <p className="font-medium text-foreground">{examInfo.age}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Seats
                  </p>
                  <p className="font-medium text-foreground">
                    {examInfo.seats}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Location
                  </p>
                  <p className="font-medium text-foreground text-sm">
                    {examInfo.location}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Subjects
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {examInfo.subjects.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            {recentAttempts.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-display font-bold text-foreground mb-4 text-lg flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Recent Attempts
                </h3>
                <div className="space-y-3">
                  {recentAttempts.map((attempt) => {
                    const pct = Math.round(
                      (Number(attempt.score) / Number(attempt.total)) * 100,
                    );
                    return (
                      <div
                        key={attempt.testId.toString()}
                        className="flex items-center justify-between text-sm"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            Test #{attempt.testId.toString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {Number(attempt.score)}/{Number(attempt.total)}
                          </p>
                        </div>
                        <div
                          className={`text-sm font-bold ${pct >= 60 ? "text-india-green" : "text-red-500"}`}
                        >
                          {pct}%
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-3 text-xs"
                  onClick={() => onNavigate("progress")}
                >
                  View All Progress
                </Button>
              </div>
            )}

            {/* Go Premium Panel */}
            <div
              data-ocid="dashboard.premium.card"
              className="rounded-xl border-2 border-saffron-400/60 p-5 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(145deg, oklch(0.18 0.07 255) 0%, oklch(0.14 0.05 250) 100%)",
              }}
            >
              {/* Glow */}
              <div
                className="absolute top-0 right-0 w-28 h-28 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.75 0.18 50 / 0.15) 0%, transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-saffron-400" />
                  <span className="font-display font-bold text-sm uppercase tracking-wider text-saffron-400">
                    Go Premium
                  </span>
                  <Badge className="bg-saffron-400 text-navy-900 text-[10px] font-bold px-2 py-0.5 ml-auto">
                    ₹499/yr
                  </Badge>
                </div>
                <p className="text-navy-200 text-xs mb-3 leading-relaxed">
                  Unlock unlimited practice, mock tests, and full study notes
                  for all 4 exams.
                </p>
                <ul className="space-y-1.5 mb-4">
                  {[
                    "Unlimited mock tests & analytics",
                    "All past year question papers",
                    "Priority WhatsApp support",
                  ].map((feat) => (
                    <li
                      key={feat}
                      className="flex items-center gap-2 text-xs text-navy-100"
                    >
                      <Check className="w-3 h-3 text-saffron-400 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Button
                  data-ocid="dashboard.premium.primary_button"
                  size="sm"
                  onClick={() => onNavigate("pricing")}
                  className="w-full bg-saffron-400 hover:bg-saffron-500 text-navy-900 font-bold border-0 text-xs h-9"
                >
                  <Crown className="w-3.5 h-3.5 mr-1.5" />
                  View Pricing Plans
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
