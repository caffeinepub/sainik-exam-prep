import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ChevronRight,
  ClipboardList,
  FileText,
  LogIn,
  Shield,
  Star,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { ExamCategory } from "../hooks/useQueries";
import type { Page } from "../types";
import { EXAM_INFO } from "../utils/examInfo";

interface HomePageProps {
  onNavigate: (page: Page, data?: unknown) => void;
  onSelectCategory: (cat: ExamCategory) => void;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const FEATURES = [
  {
    icon: BookOpen,
    title: "Practice Questions",
    desc: "1000+ curated questions with detailed explanations for thorough understanding.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: ClipboardList,
    title: "Mock Tests",
    desc: "Full-length timed tests that simulate the actual exam environment.",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: FileText,
    title: "Study Notes",
    desc: "Comprehensive chapter-wise notes curated by expert educators.",
    color: "text-saffron-500 bg-saffron-50",
  },
  {
    icon: Trophy,
    title: "Leaderboard",
    desc: "Compete with peers and track your rank among thousands of aspirants.",
    color: "text-violet-600 bg-violet-50",
  },
];

const STATS = [
  { value: "10,000+", label: "Students Enrolled", icon: Users },
  { value: "50,000+", label: "Questions Practiced", icon: Target },
  { value: "95%", label: "Success Rate", icon: Star },
  { value: "4", label: "Exam Categories", icon: Shield },
];

export function HomePage({ onNavigate, onSelectCategory }: HomePageProps) {
  const { identity, login, isLoggingIn } = useInternetIdentity();

  const handleStartPreparing = (cat: ExamCategory) => {
    onSelectCategory(cat);
    onNavigate("dashboard");
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-exam-prep.dim_1600x700.jpg"
            alt="Sainik Exam Prep"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/70 via-navy-900/60 to-background" />
          {/* India Tricolor accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 flex">
            <div className="flex-1 bg-india-saffron" />
            <div className="flex-1 bg-india-white" />
            <div className="flex-1 bg-india-green" />
          </div>
        </div>

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div variants={itemVariants} className="mb-4">
              <Badge className="bg-saffron-400/20 text-saffron-400 border-saffron-400/30 text-xs font-semibold tracking-wider uppercase px-3 py-1">
                <Star className="w-3 h-3 mr-1.5" />
                India's Premier Military School Prep Platform
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-6"
            >
              Prepare for Your{" "}
              <span className="text-gradient-saffron">Dream School</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-navy-100 mb-8 leading-relaxed max-w-2xl"
            >
              Master RIMC, Sainik School, RMS, and Navodaya entrance exams with
              expertly crafted practice questions, full mock tests, and
              comprehensive study notes. Your journey to excellence starts here.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                className="bg-saffron-400 hover:bg-saffron-500 text-navy-900 font-bold text-base px-8 shadow-saffron border-0"
                onClick={() => onNavigate("practice")}
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Practicing Now
              </Button>
              {!identity && (
                <Button
                  data-ocid="nav.login_button"
                  size="lg"
                  variant="outline"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent font-semibold text-base px-8"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  {isLoggingIn ? "Logging in..." : "Login to Track Progress"}
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-navy-800 border-y border-navy-700">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-2">
                  <Icon className="w-5 h-5 text-saffron-400 mr-2" />
                  <span className="font-display font-bold text-2xl text-white">
                    {value}
                  </span>
                </div>
                <p className="text-navy-300 text-sm font-body">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Category Cards */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your{" "}
            <span className="text-gradient-saffron">Exam Category</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tailored preparation material for each entrance exam with
            subject-specific practice and mock tests.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { cat: ExamCategory.rimc, marker: "home.rimc_card" },
            { cat: ExamCategory.sainikSchool, marker: "home.sainik_card" },
            { cat: ExamCategory.rms, marker: "home.rms_card" },
            { cat: ExamCategory.navodaya, marker: "home.navodaya_card" },
          ].map(({ cat, marker }, idx) => {
            const info = EXAM_INFO[cat];
            return (
              <motion.div
                key={cat}
                data-ocid={marker}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group cursor-pointer"
                onClick={() => handleStartPreparing(cat)}
              >
                <div className="relative overflow-hidden rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 bg-card h-full">
                  {/* Top accent */}
                  <div className="h-1.5 w-full flex">
                    <div className="flex-1 bg-india-saffron" />
                    <div className="flex-1 bg-india-white" />
                    <div className="flex-1 bg-india-green" />
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-4xl mb-3">{info.icon}</div>
                        <h3 className="font-display text-xl font-bold text-foreground mb-1">
                          {info.fullName}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs font-semibold text-muted-foreground"
                        >
                          {info.name}
                        </Badge>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-saffron-100 transition-colors">
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-saffron-500 transition-colors" />
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                      {info.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-saffron-500 font-semibold text-xs uppercase tracking-wider mt-0.5">
                          Age
                        </span>
                        <span className="text-foreground font-medium">
                          {info.age}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-india-green font-semibold text-xs uppercase tracking-wider mt-0.5">
                          Seats
                        </span>
                        <span className="text-foreground font-medium">
                          {info.seats}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {info.subjects.map((subj) => (
                        <span
                          key={subj}
                          className="px-2.5 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground"
                        >
                          {subj}
                        </span>
                      ))}
                    </div>

                    <Button className="w-full bg-navy-800 hover:bg-saffron-400 text-white hover:text-navy-900 font-semibold transition-all duration-300 border-0">
                      Start Preparing
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/40">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A complete learning ecosystem designed for military and government
              school entrance exams.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border shadow-xs hover:shadow-card transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!identity && (
        <section className="py-16 md:py-20 bg-military">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Track Your Progress & Compete
              </h2>
              <p className="text-navy-200 text-lg mb-8 max-w-xl mx-auto">
                Create a free account to save your progress, appear on the
                leaderboard, and unlock personalized insights.
              </p>
              <Button
                size="lg"
                onClick={login}
                disabled={isLoggingIn}
                className="bg-saffron-400 hover:bg-saffron-500 text-navy-900 font-bold text-base px-10 border-0 shadow-saffron"
              >
                <LogIn className="w-5 h-5 mr-2" />
                {isLoggingIn ? "Connecting..." : "Login with Internet Identity"}
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>
            © {new Date().getFullYear()}. Built with{" "}
            <span className="text-red-500">♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-saffron-500 hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
