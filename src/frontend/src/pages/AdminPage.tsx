import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
  BookOpen,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Database,
  FileText,
  KeyRound,
  Loader2,
  Plus,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  ExamCategory,
  Subject,
  useAddQuestion,
  useAddStudyNote,
  useClaimAdminWithCode,
  useClaimFirstAdmin,
  useCreateMockTest,
  useInitializeAdmin,
  useIsAdmin,
} from "../hooks/useQueries";
import { EXAM_INFO, SUBJECT_INFO } from "../utils/examInfo";
import {
  clearRazorpayKeyId,
  getRazorpayKeyId,
  isRazorpayConfigured,
  setRazorpayKeyId,
} from "../utils/razorpay";
import {
  ALL_SEED_MOCK_TESTS,
  ALL_SEED_NOTES,
  ALL_SEED_QUESTIONS,
  type SeedMockTestDef,
} from "../utils/seedData";

export function AdminPage() {
  const { data: isAdmin, isLoading } = useIsAdmin();
  const { isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity;

  // Show spinner while actor is initialising OR while the isAdmin query is running
  if (actorFetching || isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl border border-border p-10 text-center max-w-md shadow-card w-full">
          <ShieldAlert className="w-14 h-14 text-destructive mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground mb-6">
            You don't have admin privileges to access this page.
          </p>
          {isLoggedIn && <AdminActivationForm />}
          {!isLoggedIn && (
            <p className="text-sm text-muted-foreground">
              Please log in first, then use the admin activation form to claim
              admin access.
            </p>
          )}
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
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="question" className="gap-1.5">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Question</span>
              <span className="sm:hidden">Q</span>
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
            <TabsTrigger
              value="payments"
              className="gap-1.5"
              data-ocid="admin.payments.tab"
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Payments</span>
              <span className="sm:hidden">Pay</span>
            </TabsTrigger>
            <TabsTrigger
              value="seed"
              className="gap-1.5"
              data-ocid="admin.seed.tab"
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Seed</span>
              <span className="sm:hidden">Seed</span>
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
          <TabsContent value="payments">
            <PaymentsConfigForm />
          </TabsContent>
          <TabsContent value="seed">
            <SeedContentPanel />
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

function PaymentsConfigForm() {
  const [keyInput, setKeyInput] = useState("");
  const [isConfigured, setIsConfigured] = useState(() =>
    isRazorpayConfigured(),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = keyInput.trim();
    if (!trimmed) {
      toast.error("Please enter your Razorpay Key ID");
      return;
    }
    if (!trimmed.startsWith("rzp_test_") && !trimmed.startsWith("rzp_live_")) {
      toast.error(
        "Invalid key format. It should start with rzp_test_ or rzp_live_",
      );
      return;
    }
    setIsSaving(true);
    try {
      setRazorpayKeyId(trimmed);
      setIsConfigured(true);
      setKeyInput("");
      toast.success("Razorpay configuration saved successfully!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearKey = () => {
    setIsClearing(true);
    try {
      clearRazorpayKeyId();
      setIsConfigured(false);
      toast.success("Razorpay key removed successfully");
    } finally {
      setIsClearing(false);
    }
  };

  const currentKey = getRazorpayKeyId();
  const maskedKey = currentKey
    ? `${currentKey.slice(0, 12)}${"•".repeat(Math.max(0, currentKey.length - 12))}`
    : null;

  const paymentMethods = [
    { icon: "₹", label: "UPI", desc: "Google Pay, PhonePe, Paytm" },
    { icon: "💳", label: "Cards", desc: "Visa, Mastercard, RuPay" },
    { icon: "🏦", label: "Net Banking", desc: "All major Indian banks" },
    { icon: "👛", label: "Wallets", desc: "Paytm, Mobikwik & more" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border shadow-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-saffron-500" />
          Payment Configuration
        </h2>
        <Badge
          className={
            isConfigured
              ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
              : "bg-amber-500/15 text-amber-600 border-amber-500/30"
          }
        >
          {isConfigured ? "✓ Configured" : "⚠ Not Configured"}
        </Badge>
      </div>

      {/* Accepted payment methods */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {paymentMethods.map((method) => (
          <div
            key={method.label}
            className="bg-secondary/50 rounded-xl p-3 text-center border border-border"
          >
            <div className="text-2xl mb-1">{method.icon}</div>
            <div className="text-xs font-bold text-foreground">
              {method.label}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {method.desc}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-saffron-400/10 border border-saffron-400/30 rounded-xl p-4 mb-6">
        <p className="text-sm text-foreground font-semibold mb-1">
          🇮🇳 Powered by Razorpay
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Enter your Razorpay Key ID to activate UPI, Visa/Mastercard/RuPay
          cards, Net Banking, and Wallets for Indian students. Get your key from{" "}
          <a
            href="https://dashboard.razorpay.com/app/keys"
            target="_blank"
            rel="noreferrer"
            className="text-saffron-500 underline underline-offset-2 hover:text-saffron-600"
          >
            dashboard.razorpay.com
          </a>
          .
        </p>
      </div>

      {isConfigured && maskedKey && (
        <div className="mb-5 flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <CreditCard className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="text-xs text-emerald-700 font-mono">
            {maskedKey}
          </span>
          <span className="text-xs text-emerald-600 ml-1">— active</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label className="text-sm font-semibold mb-1.5 block">
            Razorpay Key ID
          </Label>
          <Input
            data-ocid="admin.payments.razorpay_input"
            type="text"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="rzp_test_... or rzp_live_..."
            className="font-mono text-sm"
            required
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            Use <span className="font-mono">rzp_test_...</span> for testing,{" "}
            <span className="font-mono">rzp_live_...</span> for production. The
            Key ID is stored locally in your browser.
          </p>
        </div>

        <Button
          data-ocid="admin.payments.submit_button"
          type="submit"
          disabled={isSaving}
          className="w-full bg-navy-800 hover:bg-saffron-400 hover:text-navy-900 text-white font-bold border-0 transition-all duration-300 h-11"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Save Configuration
            </>
          )}
        </Button>
      </form>

      {isConfigured && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="bg-destructive/8 border border-destructive/25 rounded-xl p-4">
            <p className="text-sm font-semibold text-foreground mb-1">
              Remove Current Razorpay Key
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              This will permanently remove the saved Razorpay key from this
              browser. You will need to re-enter it to re-activate payments.
            </p>
            <Button
              data-ocid="admin.payments.clear_button"
              type="button"
              variant="destructive"
              disabled={isClearing}
              onClick={handleClearKey}
              className="w-full h-10 font-semibold"
            >
              {isClearing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Key
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Helper: compute question ID ranges per exam+subject ─────────────────────
// Questions are seeded in this fixed order (8 each):
// RIMC:    math(1-8), english(9-16), gk(17-24), reasoning(25-32)
// Sainik:  math(33-40), english(41-48), gk(49-56), reasoning(57-64)
// RMS:     math(65-72), english(73-80), gk(81-88), reasoning(89-96)
// Navodaya:math(97-104), english(105-112), gk(113-120), reasoning(121-128)

const EXAM_OFFSET: Record<ExamCategory, number> = {
  [ExamCategory.rimc]: 0,
  [ExamCategory.sainikSchool]: 32,
  [ExamCategory.rms]: 64,
  [ExamCategory.navodaya]: 96,
};

const SUBJECT_OFFSET: Record<Subject, number> = {
  [Subject.math]: 0,
  [Subject.english]: 8,
  [Subject.gk]: 16,
  [Subject.reasoning]: 24,
};

function getQuestionIdsForTest(def: SeedMockTestDef): bigint[] {
  const examBase = EXAM_OFFSET[def.examCategory] + 1; // 1-indexed
  if (def.subjectFilter !== undefined) {
    const subjectBase = examBase + SUBJECT_OFFSET[def.subjectFilter];
    return Array.from({ length: 8 }, (_, i) => BigInt(subjectBase + i));
  }
  // All 32 questions for the exam
  return Array.from({ length: 32 }, (_, i) => BigInt(examBase + i));
}

// ─── Seed status types ────────────────────────────────────────────────────────
type SeedStatus = "idle" | "seeding" | "done" | "error";

interface SeedProgress {
  current: number;
  total: number;
  status: SeedStatus;
  errorMsg?: string;
}

// ─── Individual seed section card ────────────────────────────────────────────
interface SeedSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  count: string;
  progress: SeedProgress;
  onSeed: () => void;
  ocidPrefix: string;
}

function SeedSection({
  icon,
  title,
  description,
  count,
  progress,
  onSeed,
  ocidPrefix,
}: SeedSectionProps) {
  const isIdle = progress.status === "idle";
  const isSeeding = progress.status === "seeding";
  const isDone = progress.status === "done";
  const isError = progress.status === "error";
  const pct =
    progress.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : 0;

  return (
    <div className="bg-secondary/40 border border-border rounded-xl p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-saffron-400/15 flex items-center justify-center text-saffron-500 flex-shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          </div>
        </div>

        {/* Status badge */}
        {isIdle && (
          <Badge
            data-ocid={`${ocidPrefix}.idle_state`}
            className="bg-secondary text-muted-foreground border-border text-xs shrink-0"
          >
            Ready
          </Badge>
        )}
        {isSeeding && (
          <Badge
            data-ocid={`${ocidPrefix}.loading_state`}
            className="bg-amber-500/15 text-amber-600 border-amber-500/30 text-xs shrink-0 flex items-center gap-1"
          >
            <Loader2 className="w-3 h-3 animate-spin" />
            Seeding…
          </Badge>
        )}
        {isDone && (
          <Badge
            data-ocid={`${ocidPrefix}.success_state`}
            className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-xs shrink-0 flex items-center gap-1"
          >
            <CheckCircle2 className="w-3 h-3" />
            Done
          </Badge>
        )}
        {isError && (
          <Badge
            data-ocid={`${ocidPrefix}.error_state`}
            className="bg-destructive/15 text-destructive border-destructive/30 text-xs shrink-0 flex items-center gap-1"
          >
            <XCircle className="w-3 h-3" />
            Error
          </Badge>
        )}
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground">{count}</p>

      {/* Progress bar (shown while seeding or done) */}
      {(isSeeding || isDone) && (
        <div className="space-y-1.5">
          <Progress value={isDone ? 100 : pct} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {isDone
              ? `✓ All ${progress.total} items seeded`
              : `Seeding ${progress.current} / ${progress.total}…`}
          </p>
        </div>
      )}

      {/* Error message */}
      {isError && progress.errorMsg && (
        <p className="text-xs text-destructive bg-destructive/8 rounded-lg px-3 py-2 border border-destructive/20">
          {progress.errorMsg}
        </p>
      )}

      {/* Action button */}
      <Button
        data-ocid={`${ocidPrefix}.primary_button`}
        type="button"
        disabled={isSeeding || isDone}
        onClick={onSeed}
        className={`w-full h-10 font-semibold text-sm border-0 transition-all duration-300 ${
          isDone
            ? "bg-emerald-500/20 text-emerald-700 cursor-default"
            : isSeeding
              ? "bg-amber-500/20 text-amber-700 cursor-not-allowed"
              : "bg-navy-800 hover:bg-saffron-400 hover:text-navy-900 text-white"
        }`}
      >
        {isSeeding ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Seeding {progress.current} / {progress.total}…
          </>
        ) : isDone ? (
          <>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Seeded Successfully
          </>
        ) : (
          <>
            <Database className="w-4 h-4 mr-2" />
            {title}
          </>
        )}
      </Button>
    </div>
  );
}

// ─── Main Seed Content Panel ──────────────────────────────────────────────────
function SeedContentPanel() {
  const { mutateAsync: addQuestion } = useAddQuestion();
  const { mutateAsync: addNote } = useAddStudyNote();
  const { mutateAsync: createMockTest } = useCreateMockTest();

  const [notesProgress, setNotesProgress] = useState<SeedProgress>({
    current: 0,
    total: ALL_SEED_NOTES.length,
    status: "idle",
  });
  const [questionsProgress, setQuestionsProgress] = useState<SeedProgress>({
    current: 0,
    total: ALL_SEED_QUESTIONS.length,
    status: "idle",
  });
  const [mocktestsProgress, setMocktestsProgress] = useState<SeedProgress>({
    current: 0,
    total: ALL_SEED_MOCK_TESTS.length,
    status: "idle",
  });

  const handleSeedNotes = async () => {
    setNotesProgress({
      current: 0,
      total: ALL_SEED_NOTES.length,
      status: "seeding",
    });
    try {
      for (let i = 0; i < ALL_SEED_NOTES.length; i++) {
        const note = ALL_SEED_NOTES[i];
        await addNote({
          examCategory: note.examCategory,
          subject: note.subject,
          topic: note.topic,
          content: note.content,
        });
        setNotesProgress((prev) => ({ ...prev, current: i + 1 }));
      }
      setNotesProgress((prev) => ({ ...prev, status: "done" }));
      toast.success(`Seeded ${ALL_SEED_NOTES.length} study notes!`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setNotesProgress((prev) => ({ ...prev, status: "error", errorMsg: msg }));
      toast.error("Failed to seed study notes");
    }
  };

  const handleSeedQuestions = async () => {
    setQuestionsProgress({
      current: 0,
      total: ALL_SEED_QUESTIONS.length,
      status: "seeding",
    });
    try {
      for (let i = 0; i < ALL_SEED_QUESTIONS.length; i++) {
        const q = ALL_SEED_QUESTIONS[i];
        await addQuestion({
          examCategory: q.examCategory,
          subject: q.subject,
          topic: q.topic,
          question: q.question,
          options: q.options,
          correctAnswer: BigInt(q.correctAnswer),
          explanation: q.explanation,
        });
        setQuestionsProgress((prev) => ({ ...prev, current: i + 1 }));
      }
      setQuestionsProgress((prev) => ({ ...prev, status: "done" }));
      toast.success(`Seeded ${ALL_SEED_QUESTIONS.length} questions!`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setQuestionsProgress((prev) => ({
        ...prev,
        status: "error",
        errorMsg: msg,
      }));
      toast.error("Failed to seed questions");
    }
  };

  const handleSeedMockTests = async () => {
    setMocktestsProgress({
      current: 0,
      total: ALL_SEED_MOCK_TESTS.length,
      status: "seeding",
    });
    try {
      for (let i = 0; i < ALL_SEED_MOCK_TESTS.length; i++) {
        const def = ALL_SEED_MOCK_TESTS[i];
        const questionIds = getQuestionIdsForTest(def);
        await createMockTest({
          title: def.title,
          examCategory: def.examCategory,
          questionIds,
          durationMinutes: BigInt(def.durationMinutes),
        });
        setMocktestsProgress((prev) => ({ ...prev, current: i + 1 }));
      }
      setMocktestsProgress((prev) => ({ ...prev, status: "done" }));
      toast.success(`Seeded ${ALL_SEED_MOCK_TESTS.length} mock tests!`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setMocktestsProgress((prev) => ({
        ...prev,
        status: "error",
        errorMsg: msg,
      }));
      toast.error("Failed to seed mock tests");
    }
  };

  const allDone =
    notesProgress.status === "done" &&
    questionsProgress.status === "done" &&
    mocktestsProgress.status === "done";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border shadow-card p-6 space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-1 flex items-center gap-2">
          <Database className="w-5 h-5 text-saffron-500" />
          Seed Content
        </h2>
        <p className="text-sm text-muted-foreground">
          Bulk-load comprehensive exam content into the app in one click.
        </p>
      </div>

      {/* Warning banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 flex gap-3">
        <span className="text-amber-500 text-lg leading-none mt-0.5">⚠️</span>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            Run this only once, after becoming admin for the first time.
          </p>
          <p className="text-xs text-muted-foreground">
            Seeding again will create duplicate questions, notes, and tests.
            Seed Notes and Questions <strong>before</strong> seeding Mock Tests
            — mock tests reference specific question IDs.
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${notesProgress.status === "done" ? "bg-emerald-500" : "bg-navy-700"}`}
        >
          1
        </span>
        <span className="flex-1 h-px bg-border" />
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${questionsProgress.status === "done" ? "bg-emerald-500" : "bg-navy-700"}`}
        >
          2
        </span>
        <span className="flex-1 h-px bg-border" />
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${mocktestsProgress.status === "done" ? "bg-emerald-500" : "bg-navy-700"}`}
        >
          3
        </span>
      </div>

      {/* Section 1: Study Notes */}
      <SeedSection
        icon={<BookOpen className="w-5 h-5" />}
        title="Seed Study Notes"
        description="Comprehensive notes covering complete syllabus for all 4 exams."
        count={`${ALL_SEED_NOTES.length} notes — RIMC, Sainik School, RMS, Navodaya (Math, English, GK, Reasoning)`}
        progress={notesProgress}
        onSeed={handleSeedNotes}
        ocidPrefix="seed.notes"
      />

      {/* Section 2: Questions */}
      <SeedSection
        icon={<ClipboardList className="w-5 h-5" />}
        title="Seed Questions"
        description="128 curriculum-aligned MCQs, 8 per subject per exam."
        count={`${ALL_SEED_QUESTIONS.length} questions — 4 exams × 4 subjects × 8 questions each`}
        progress={questionsProgress}
        onSeed={handleSeedQuestions}
        ocidPrefix="seed.questions"
      />

      {/* Section 3: Mock Tests */}
      <SeedSection
        icon={<FileText className="w-5 h-5" />}
        title="Seed Mock Tests"
        description="Pre-built timed tests using the seeded questions above."
        count={`${ALL_SEED_MOCK_TESTS.length} mock tests — full exams + subject-specific drills for each category`}
        progress={mocktestsProgress}
        onSeed={handleSeedMockTests}
        ocidPrefix="seed.mocktests"
      />

      {/* All done message */}
      {allDone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-5 py-4 text-center"
          data-ocid="seed.success_state"
        >
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm font-bold text-foreground mb-1">
            All content seeded successfully!
          </p>
          <p className="text-xs text-muted-foreground">
            Visit Study Notes and Mock Tests pages — students can now practise
            immediately.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

const ADMIN_SECRET_CODE = "SAINIK2024ADMIN";

function AdminActivationForm() {
  const { isFetching: actorFetching } = useActor();
  const actorReady = !actorFetching;

  const { mutateAsync: initializeAdmin, isPending: isTokenPending } =
    useInitializeAdmin();
  const {
    mutateAsync: claimFirstAdmin,
    isPending: isClaimPending,
    isError: isClaimError,
  } = useClaimFirstAdmin();
  const { mutateAsync: claimAdminWithCode, isPending: isCodePending } =
    useClaimAdminWithCode();
  const [token, setToken] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [codeError, setCodeError] = useState("");

  const handleClaim = async () => {
    try {
      await claimFirstAdmin();
      toast.success("You are now admin!");
      setTimeout(() => window.location.reload(), 800);
    } catch {
      toast.error("Admin already assigned to another account.");
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError("");
    const trimmed = secretCode.trim();
    if (!trimmed) {
      setCodeError("Please enter the secret code");
      return;
    }
    try {
      const success = await claimAdminWithCode(trimmed);
      if (success) {
        toast.success("Admin access granted! Reloading...");
        setTimeout(() => window.location.reload(), 800);
      } else {
        setCodeError("Invalid secret code. Please try again.");
      }
    } catch {
      setCodeError("Something went wrong. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = token.trim();
    if (!trimmed) {
      toast.error("Please enter the admin token");
      return;
    }
    try {
      await initializeAdmin(trimmed);
      toast.success("Admin access activated! Please refresh the page.");
      setToken("");
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      toast.error(
        "Invalid token or admin role already assigned to another account.",
      );
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ADMIN_SECRET_CODE).then(() => {
      toast.success("Code copied to clipboard!");
    });
  };

  return (
    <div className="mt-2 text-left border-t border-border pt-6 space-y-6">
      {/* Connecting indicator */}
      {actorFetching && (
        <div
          data-ocid="admin.activation.loading_state"
          className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2"
        >
          <Loader2 className="w-3 h-3 animate-spin" />
          Connecting to server...
        </div>
      )}

      {/* One-click claim section */}
      <div className="bg-saffron-400/10 border border-saffron-400/30 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-saffron-500" />
          <h3 className="text-sm font-bold text-foreground">
            Claim Admin Access
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          If no admin has been assigned yet, click below to instantly become
          admin.
        </p>
        <Button
          data-ocid="admin.claim.primary_button"
          type="button"
          disabled={isClaimPending || !actorReady}
          onClick={handleClaim}
          className="w-full bg-saffron-400 hover:bg-saffron-500 text-navy-900 font-bold border-0 transition-all duration-300 h-11 text-sm"
        >
          {!actorReady ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Connecting to server...
            </>
          ) : isClaimPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Claiming Admin...
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 mr-2" />
              Claim Admin Access
            </>
          )}
        </Button>
        {isClaimError && (
          <p
            data-ocid="admin.claim.error_state"
            className="mt-2 text-xs text-destructive text-center"
          >
            Admin already assigned to another account.
          </p>
        )}
      </div>

      {/* Secret code section */}
      <div className="bg-navy-800/10 border border-navy-700/30 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <KeyRound className="w-5 h-5 text-navy-600" />
          <h3 className="text-sm font-bold text-foreground">
            Use Secret Admin Code
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Enter the secret admin code to claim admin rights even if another
          account already registered.
        </p>
        <form onSubmit={handleCodeSubmit} className="space-y-3">
          <Input
            data-ocid="admin.secretcode.input"
            type="text"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            placeholder="Enter secret admin code..."
            className="font-mono text-sm"
          />
          {/* Clickable hint box showing the code */}
          <button
            type="button"
            onClick={handleCopyCode}
            title="Click to copy"
            className="w-full text-left bg-muted rounded-lg p-2 font-mono text-sm cursor-copy select-all border border-border hover:bg-muted/80 transition-colors"
          >
            <span className="text-xs text-muted-foreground mr-1">
              The admin code is:
            </span>
            <span className="font-bold text-foreground">
              {ADMIN_SECRET_CODE}
            </span>
          </button>
          {codeError && <p className="text-xs text-destructive">{codeError}</p>}
          <Button
            data-ocid="admin.secretcode.submit_button"
            type="submit"
            disabled={isCodePending || !actorReady}
            className="w-full bg-navy-800 hover:bg-saffron-400 hover:text-navy-900 text-white font-bold border-0 transition-all duration-300 h-10"
          >
            {!actorReady ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting to server...
              </>
            ) : isCodePending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 mr-2" />
                Claim with Code
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Manual token fallback */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground font-medium">
            Or use an admin token
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <KeyRound className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm font-semibold text-foreground">
            Already have an admin token?
          </p>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Paste your admin token here to claim admin access directly.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            data-ocid="admin.activation.input"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter admin token..."
            className="font-mono text-sm"
            required
          />
          <Button
            data-ocid="admin.activation.submit_button"
            type="submit"
            disabled={isTokenPending || !actorReady}
            className="w-full bg-navy-800 hover:bg-saffron-400 hover:text-navy-900 text-white font-bold border-0 transition-all duration-300 h-10"
          >
            {!actorReady ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting to server...
              </>
            ) : isTokenPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Activating...
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4 mr-2" />
                Activate Admin
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
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
