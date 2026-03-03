import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ClipboardList,
  FileText,
  Loader2,
  Plus,
  Settings,
  ShieldAlert,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  ExamCategory,
  Subject,
  useAddQuestion,
  useAddStudyNote,
  useCreateMockTest,
  useIsAdmin,
} from "../hooks/useQueries";
import { EXAM_INFO, SUBJECT_INFO } from "../utils/examInfo";

export function AdminPage() {
  const { data: isAdmin, isLoading } = useIsAdmin();

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl border border-border p-10 text-center max-w-md shadow-card">
          <ShieldAlert className="w-14 h-14 text-destructive mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            You don't have admin privileges to access this page.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-12">
      {/* Header */}
      <div className="bg-military border-b border-navy-700/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-saffron-400" />
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
                Admin Panel
              </h1>
              <p className="text-navy-300 text-sm">
                Manage questions, tests, and study notes
              </p>
            </div>
            <Badge className="ml-auto bg-saffron-400/20 text-saffron-400 border-saffron-400/30">
              Admin Access
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Tabs defaultValue="question">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="question" className="gap-1.5">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Question</span>
              <span className="sm:hidden">Question</span>
            </TabsTrigger>
            <TabsTrigger value="mocktest" className="gap-1.5">
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Create Test</span>
              <span className="sm:hidden">Test</span>
            </TabsTrigger>
            <TabsTrigger value="note" className="gap-1.5">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Add Note</span>
              <span className="sm:hidden">Note</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="question">
            <AddQuestionForm />
          </TabsContent>
          <TabsContent value="mocktest">
            <CreateMockTestForm />
          </TabsContent>
          <TabsContent value="note">
            <AddStudyNoteForm />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function AddQuestionForm() {
  const { mutateAsync: addQuestion, isPending } = useAddQuestion();
  const [form, setForm] = useState({
    examCategory: ExamCategory.rimc,
    subject: Subject.math,
    topic: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
  });

  const handleOptionChange = (idx: number, value: string) => {
    setForm((prev) => {
      const options = [...prev.options];
      options[idx] = value;
      return { ...prev, options };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic || !form.question || form.options.some((o) => !o)) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await addQuestion({
        examCategory: form.examCategory,
        subject: form.subject,
        topic: form.topic,
        question: form.question,
        options: form.options,
        correctAnswer: BigInt(form.correctAnswer),
        explanation: form.explanation,
      });
      toast.success("Question added successfully!");
      setForm((prev) => ({
        ...prev,
        topic: "",
        question: "",
        options: ["", "", "", ""],
        explanation: "",
      }));
    } catch {
      toast.error("Failed to add question");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border shadow-card p-6"
    >
      <h2 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <Plus className="w-5 h-5 text-saffron-500" />
        Add New Question
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-semibold mb-1.5 block">
              Exam Category
            </Label>
            <Select
              value={form.examCategory}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, examCategory: v as ExamCategory }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ExamCategory).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {EXAM_INFO[cat].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-semibold mb-1.5 block">
              Subject
            </Label>
            <Select
              value={form.subject}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, subject: v as Subject }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Subject).map((subj) => (
                  <SelectItem key={subj} value={subj}>
                    {SUBJECT_INFO[subj].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-1.5 block">Topic</Label>
          <Input
            data-ocid="admin.question.input"
            value={form.topic}
            onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))}
            placeholder="e.g., Fractions, Tenses, Indian History"
            required
          />
        </div>

        <div>
          <Label className="text-sm font-semibold mb-1.5 block">Question</Label>
          <Textarea
            value={form.question}
            onChange={(e) =>
              setForm((p) => ({ ...p, question: e.target.value }))
            }
            placeholder="Enter the question text..."
            rows={3}
            required
          />
        </div>

        <div>
          <Label className="text-sm font-semibold mb-2 block">
            Answer Options
          </Label>
          <div className="space-y-2">
            {form.options.map((opt, idx) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: options are positional
                key={idx}
                className="flex gap-2 items-center"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    form.correctAnswer === idx
                      ? "bg-india-green text-white"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </div>
                <Input
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                  required
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, correctAnswer: idx }))}
                  className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                    form.correctAnswer === idx
                      ? "bg-india-green text-white"
                      : "bg-secondary text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {form.correctAnswer === idx ? "✓ Correct" : "Set Correct"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-1.5 block">
            Explanation (optional)
          </Label>
          <Textarea
            value={form.explanation}
            onChange={(e) =>
              setForm((p) => ({ ...p, explanation: e.target.value }))
            }
            placeholder="Explain why the correct answer is right..."
            rows={2}
          />
        </div>

        <Button
          data-ocid="admin.question.submit_button"
          type="submit"
          disabled={isPending}
          className="w-full bg-navy-800 hover:bg-saffron-400 hover:text-navy-900 text-white font-bold border-0 transition-all duration-300 h-11"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}

function CreateMockTestForm() {
  const { mutateAsync: createTest, isPending } = useCreateMockTest();
  const [form, setForm] = useState({
    title: "",
    examCategory: ExamCategory.rimc,
    questionIdsStr: "",
    durationMinutes: "30",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const idStr = form.questionIdsStr.trim();
    if (!form.title || !idStr) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      const questionIds = idStr
        .split(",")
        .map((s) => BigInt(s.trim()))
        .filter((n) => !Number.isNaN(Number(n)));
      await createTest({
        title: form.title,
        examCategory: form.examCategory,
        questionIds,
        durationMinutes: BigInt(Number.parseInt(form.durationMinutes)),
      });
      toast.success("Mock test created successfully!");
      setForm((prev) => ({ ...prev, title: "", questionIdsStr: "" }));
    } catch {
      toast.error("Failed to create mock test");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border shadow-card p-6"
    >
      <h2 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <ClipboardList className="w-5 h-5 text-saffron-500" />
        Create Mock Test
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label className="text-sm font-semibold mb-1.5 block">
            Test Title
          </Label>
          <Input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="e.g., RIMC 2024 Full Mock Test"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-semibold mb-1.5 block">
              Exam Category
            </Label>
            <Select
              value={form.examCategory}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, examCategory: v as ExamCategory }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ExamCategory).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {EXAM_INFO[cat].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-semibold mb-1.5 block">
              Duration (minutes)
            </Label>
            <Input
              type="number"
              min="5"
              max="180"
              value={form.durationMinutes}
              onChange={(e) =>
                setForm((p) => ({ ...p, durationMinutes: e.target.value }))
              }
              required
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-1.5 block">
            Question IDs (comma-separated)
          </Label>
          <Textarea
            value={form.questionIdsStr}
            onChange={(e) =>
              setForm((p) => ({ ...p, questionIdsStr: e.target.value }))
            }
            placeholder="1, 2, 3, 4, 5, ..."
            rows={3}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter the IDs of questions to include in this test
          </p>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-navy-800 hover:bg-saffron-400 hover:text-navy-900 text-white font-bold border-0 transition-all duration-300 h-11"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <ClipboardList className="w-4 h-4 mr-2" />
              Create Mock Test
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}

function AddStudyNoteForm() {
  const { mutateAsync: addNote, isPending } = useAddStudyNote();
  const [form, setForm] = useState({
    examCategory: ExamCategory.rimc,
    subject: Subject.math,
    topic: "",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic || !form.content) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await addNote(form);
      toast.success("Study note added successfully!");
      setForm((prev) => ({ ...prev, topic: "", content: "" }));
    } catch {
      toast.error("Failed to add study note");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border shadow-card p-6"
    >
      <h2 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <FileText className="w-5 h-5 text-saffron-500" />
        Add Study Note
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-semibold mb-1.5 block">
              Exam Category
            </Label>
            <Select
              value={form.examCategory}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, examCategory: v as ExamCategory }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ExamCategory).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {EXAM_INFO[cat].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-semibold mb-1.5 block">
              Subject
            </Label>
            <Select
              value={form.subject}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, subject: v as Subject }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Subject).map((subj) => (
                  <SelectItem key={subj} value={subj}>
                    {SUBJECT_INFO[subj].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-1.5 block">Topic</Label>
          <Input
            value={form.topic}
            onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))}
            placeholder="e.g., Fractions and Decimals"
            required
          />
        </div>

        <div>
          <Label className="text-sm font-semibold mb-1.5 block">Content</Label>
          <Textarea
            value={form.content}
            onChange={(e) =>
              setForm((p) => ({ ...p, content: e.target.value }))
            }
            placeholder="Write the study note content here..."
            rows={8}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-navy-800 hover:bg-saffron-400 hover:text-navy-900 text-white font-bold border-0 transition-all duration-300 h-11"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Add Study Note
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}
