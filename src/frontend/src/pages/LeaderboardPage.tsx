import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Medal, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { ExamCategory, useLeaderboard } from "../hooks/useQueries";
import {
  EXAM_INFO,
  formatDate,
  formatPrincipal,
  getScoreColor,
} from "../utils/examInfo";

function LeaderboardTable({ category }: { category: ExamCategory }) {
  const { data: entries = [], isLoading } = useLeaderboard(category);
  const { identity } = useInternetIdentity();
  const myPrincipal = identity?.getPrincipal().toString();

  if (isLoading) {
    return (
      <div data-ocid="leaderboard.loading_state" className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div
        data-ocid="leaderboard.empty_state"
        className="text-center py-16 bg-card rounded-2xl border border-border"
      >
        <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-display text-xl font-bold text-foreground mb-2">
          No Entries Yet
        </h2>
        <p className="text-muted-foreground">
          Be the first to take a mock test in {EXAM_INFO[category].name}!
        </p>
      </div>
    );
  }

  const top20 = entries.slice(0, 20);

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50">
            <TableHead className="w-16 font-display font-bold text-foreground">
              Rank
            </TableHead>
            <TableHead className="font-display font-bold text-foreground">
              Principal
            </TableHead>
            <TableHead className="font-display font-bold text-foreground">
              Test
            </TableHead>
            <TableHead className="font-display font-bold text-foreground text-right">
              Score
            </TableHead>
            <TableHead className="font-display font-bold text-foreground hidden md:table-cell">
              Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {top20.map((entry, idx) => {
            const rank = idx + 1;
            const isMe =
              myPrincipal && entry.principal.toString() === myPrincipal;
            const pct = Number(entry.scorePercentage);

            return (
              <TableRow
                key={`${entry.principal}-${entry.timestamp}`}
                className={`${isMe ? "bg-saffron-50 font-semibold" : ""} hover:bg-secondary/30 transition-colors`}
              >
                <TableCell className="font-display">
                  {rank === 1 ? (
                    <div className="flex items-center gap-1">
                      <Crown className="w-5 h-5 text-saffron-400" />
                      <span className="rank-gold">1</span>
                    </div>
                  ) : rank === 2 ? (
                    <div className="flex items-center gap-1">
                      <Medal className="w-4 h-4 text-gray-400" />
                      <span className="rank-silver">2</span>
                    </div>
                  ) : rank === 3 ? (
                    <div className="flex items-center gap-1">
                      <Medal className="w-4 h-4 text-amber-600" />
                      <span className="rank-bronze">3</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground font-medium">
                      {rank}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-foreground">
                      {formatPrincipal(entry.principal.toString())}
                    </span>
                    {isMe && (
                      <Badge className="bg-saffron-100 text-saffron-700 border-saffron-300 text-xs px-1.5 py-0.5">
                        You
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground truncate max-w-[140px] block">
                    {entry.testTitle}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`font-display font-bold text-base ${getScoreColor(pct)}`}
                  >
                    {pct}%
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {formatDate(entry.timestamp)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-background pb-12">
      {/* Header */}
      <div className="bg-military border-b border-navy-700/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-saffron-400" />
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
              Leaderboard
            </h1>
          </div>
          <p className="text-navy-300">
            Top performers across all exam categories
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue={ExamCategory.rimc} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8 h-auto">
            <TabsTrigger
              data-ocid="leaderboard.rimc_tab"
              value={ExamCategory.rimc}
              className="flex flex-col gap-0.5 py-2.5"
            >
              <span className="text-base">🦁</span>
              <span className="text-xs font-semibold">RIMC</span>
            </TabsTrigger>
            <TabsTrigger
              data-ocid="leaderboard.sainik_tab"
              value={ExamCategory.sainikSchool}
              className="flex flex-col gap-0.5 py-2.5"
            >
              <span className="text-base">⚔️</span>
              <span className="text-xs font-semibold">Sainik</span>
            </TabsTrigger>
            <TabsTrigger
              data-ocid="leaderboard.rms_tab"
              value={ExamCategory.rms}
              className="flex flex-col gap-0.5 py-2.5"
            >
              <span className="text-base">🎖️</span>
              <span className="text-xs font-semibold">RMS</span>
            </TabsTrigger>
            <TabsTrigger
              data-ocid="leaderboard.navodaya_tab"
              value={ExamCategory.navodaya}
              className="flex flex-col gap-0.5 py-2.5"
            >
              <span className="text-base">📚</span>
              <span className="text-xs font-semibold">Navodaya</span>
            </TabsTrigger>
          </TabsList>

          {Object.values(ExamCategory).map((cat) => (
            <TabsContent key={cat} value={cat}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{EXAM_INFO[cat].icon}</span>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    {EXAM_INFO[cat].fullName}
                  </h2>
                </div>
                <LeaderboardTable category={cat} />
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  );
}
