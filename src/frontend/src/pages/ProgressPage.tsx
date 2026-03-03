import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  BarChart2,
  ClipboardList,
  Clock,
  LogIn,
  Minus,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserAttempts } from "../hooks/useQueries";
import { formatDate, getGrade, getScoreColor } from "../utils/examInfo";

export function ProgressPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: attempts = [], isLoading } = useUserAttempts();

  if (!identity) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl border border-border p-10 text-center max-w-md shadow-card">
          <AlertCircle className="w-14 h-14 text-saffron-400 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Login Required
          </h2>
          <p className="text-muted-foreground mb-6">
            Login to view your test history and track your performance over
            time.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="bg-saffron-400 hover:bg-saffron-500 text-navy-900 font-bold border-0 gap-2 w-full"
          >
            <LogIn className="w-4 h-4" />
            {isLoggingIn ? "Logging in..." : "Login to View Progress"}
          </Button>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background p-8">
        <div
          data-ocid="progress.loading_state"
          className="container mx-auto max-w-3xl space-y-4"
        >
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full rounded-xl" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </main>
    );
  }

  const sorted = [...attempts].sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp),
  );

  const avgScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce(
            (sum, a) => sum + (Number(a.score) / Number(a.total)) * 100,
            0,
          ) / attempts.length,
        )
      : 0;

  const bestScore =
    attempts.length > 0
      ? Math.round(
          Math.max(
            ...attempts.map((a) => (Number(a.score) / Number(a.total)) * 100),
          ),
        )
      : 0;

  const totalTests = attempts.length;

  const recentTrend =
    sorted.length >= 2
      ? Math.round((Number(sorted[0].score) / Number(sorted[0].total)) * 100) -
        Math.round((Number(sorted[1].score) / Number(sorted[1].total)) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-background pb-12">
      {/* Header */}
      <div className="bg-military border-b border-navy-700/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart2 className="w-8 h-8 text-saffron-400" />
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
              My Progress
            </h1>
          </div>
          <p className="text-navy-300">
            Track your performance across all tests
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Stats Overview */}
        {attempts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Tests Taken",
                value: totalTests,
                icon: ClipboardList,
                color: "bg-blue-50 text-blue-700",
              },
              {
                label: "Average Score",
                value: `${avgScore}%`,
                icon: Target,
                color: "bg-amber-50 text-amber-700",
              },
              {
                label: "Best Score",
                value: `${bestScore}%`,
                icon: Trophy,
                color: "bg-emerald-50 text-emerald-700",
              },
              {
                label: "Recent Trend",
                value:
                  recentTrend > 0
                    ? `+${recentTrend}%`
                    : recentTrend < 0
                      ? `${recentTrend}%`
                      : "—",
                icon:
                  recentTrend > 0
                    ? TrendingUp
                    : recentTrend < 0
                      ? TrendingDown
                      : Minus,
                color:
                  recentTrend > 0
                    ? "bg-emerald-50 text-emerald-700"
                    : recentTrend < 0
                      ? "bg-red-50 text-red-700"
                      : "bg-secondary text-muted-foreground",
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className={`${color} rounded-xl p-4 border border-current/10`}
              >
                <Icon className="w-5 h-5 mb-2 opacity-80" />
                <p className="text-2xl font-display font-bold">{value}</p>
                <p className="text-xs font-medium opacity-70 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Test History */}
        <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-saffron-400 rounded-full inline-block" />
          Test History
        </h2>

        {sorted.length === 0 ? (
          <div
            data-ocid="progress.empty_state"
            className="text-center py-16 bg-card rounded-2xl border border-border"
          >
            <BarChart2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold text-foreground mb-2">
              No Tests Taken Yet
            </h2>
            <p className="text-muted-foreground">
              Take your first mock test to start tracking your progress!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((attempt, idx) => {
              const pct = Math.round(
                (Number(attempt.score) / Number(attempt.total)) * 100,
              );
              const mins = Math.floor(Number(attempt.timeTaken) / 60);
              const secs = Number(attempt.timeTaken) % 60;

              return (
                <motion.div
                  key={`${attempt.testId}-${idx}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-card rounded-xl border border-border shadow-xs p-5 hover:shadow-card transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display font-bold text-foreground">
                        Test #{attempt.testId.toString()}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {mins}m {secs}s
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(attempt.timestamp)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-2xl font-display font-bold ${getScoreColor(pct)}`}
                      >
                        {pct}%
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {Number(attempt.score)}/{Number(attempt.total)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{getGrade(pct)}</span>
                      <span>{pct}%</span>
                    </div>
                    <Progress
                      value={pct}
                      className={`h-2 ${pct >= 80 ? "[&>div]:bg-india-green" : pct >= 60 ? "[&>div]:bg-saffron-400" : "[&>div]:bg-red-500"}`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
