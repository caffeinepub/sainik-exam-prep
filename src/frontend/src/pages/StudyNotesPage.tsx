import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ExamCategory, Subject, useStudyNotes } from "../hooks/useQueries";
import { EXAM_INFO, SUBJECT_INFO } from "../utils/examInfo";

interface StudyNotesPageProps {
  category: ExamCategory;
  subject: Subject;
  onCategoryChange: (cat: ExamCategory) => void;
  onSubjectChange: (subj: Subject) => void;
}

function NoteCard({
  note,
}: {
  note: {
    id: bigint;
    topic: string;
    content: string;
    subject: { __kind__?: string } | string;
  };
}) {
  const [expanded, setExpanded] = useState(false);
  const content = note.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border shadow-xs overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-saffron-50 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-saffron-500" />
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground">
              {note.topic}
            </h3>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-border"
        >
          <div className="p-5">
            <div className="prose prose-sm max-w-none text-foreground">
              {content.split("\n").map((para, i) =>
                para.trim() ? (
                  <p
                    // biome-ignore lint/suspicious/noArrayIndexKey: content paragraphs have no stable ids
                    key={i}
                    className="mb-3 text-sm leading-relaxed text-foreground/90"
                  >
                    {para}
                  </p>
                ) : (
                  // biome-ignore lint/suspicious/noArrayIndexKey: blank lines have no stable ids
                  <br key={i} />
                ),
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export function StudyNotesPage({
  category,
  subject,
  onCategoryChange,
  onSubjectChange,
}: StudyNotesPageProps) {
  const { data: notes = [], isLoading } = useStudyNotes(category, subject);

  return (
    <main className="min-h-screen bg-background pb-12">
      {/* Header */}
      <div className="bg-military border-b border-navy-700/50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-3">
            <FileText className="w-7 h-7 text-saffron-400" />
            Study Notes
          </h1>
          <div className="flex flex-wrap gap-3">
            <Select
              value={category}
              onValueChange={(v) => onCategoryChange(v as ExamCategory)}
            >
              <SelectTrigger className="w-52 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ExamCategory).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {EXAM_INFO[cat].icon} {EXAM_INFO[cat].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={subject}
              onValueChange={(v) => onSubjectChange(v as Subject)}
            >
              <SelectTrigger className="w-44 bg-white/10 border-white/20 text-white">
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
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Badge className="bg-navy-100 text-navy-800 border-navy-200">
            {EXAM_INFO[category].name}
          </Badge>
          <span className="text-muted-foreground text-sm">→</span>
          <Badge className={SUBJECT_INFO[subject].color}>
            {SUBJECT_INFO[subject].icon} {SUBJECT_INFO[subject].name}
          </Badge>
          {!isLoading && (
            <span className="text-muted-foreground text-sm">
              {notes.length} note{notes.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {isLoading ? (
          <div data-ocid="notes.loading_state" className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div
            data-ocid="notes.empty_state"
            className="text-center py-16 bg-card rounded-2xl border border-border"
          >
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold text-foreground mb-2">
              No Notes Available
            </h2>
            <p className="text-muted-foreground">
              No study notes found for {EXAM_INFO[category].name} —{" "}
              {SUBJECT_INFO[subject].name} yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <NoteCard key={note.id.toString()} note={note} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
