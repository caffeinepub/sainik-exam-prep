import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Briefcase,
  Check,
  ChevronRight,
  ClipboardList,
  Crown,
  FileText,
  LogIn,
  Mail,
  MessageCircle,
  Phone,
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
    desc: "1,000+ curated questions with detailed explanations — organised by subject and difficulty level.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: ClipboardList,
    title: "Mock Tests",
    desc: "Full-length timed tests that simulate the actual exam environment for each school.",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: FileText,
    title: "Study Notes",
    desc: "Chapter-wise notes written by educators with years of Sainik School coaching experience.",
    color: "text-saffron-500 bg-saffron-50",
  },
  {
    icon: Trophy,
    title: "Live Leaderboard",
    desc: "Compete with peers nationwide and track your rank among thousands of serious aspirants.",
    color: "text-violet-600 bg-violet-50",
  },
];

const STATS = [
  { value: "10,000+", label: "Students Enrolled", icon: Users },
  { value: "50,000+", label: "Questions Practised", icon: Target },
  { value: "95%", label: "Selection Rate", icon: Star },
  { value: "4", label: "Exam Categories", icon: Shield },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose Your Exam",
    desc: "Select from RIMC, Sainik School, RMS, or Navodaya — each with its own dedicated practice set and syllabus.",
  },
  {
    step: "02",
    title: "Practice & Learn",
    desc: "Attempt subject-wise questions, study our notes, and take full mock tests under timed conditions.",
  },
  {
    step: "03",
    title: "Track Your Progress",
    desc: "Monitor scores, see where you stand on the leaderboard, and focus on weak areas with analytics.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Sainik Prep's mock tests were almost identical to the actual RIMC paper. The detailed explanations helped me understand my mistakes and improve fast.",
    name: "Arjun Singh",
    school: "RIMC, Dehradun — 2023 Batch",
    initials: "AS",
  },
  {
    quote:
      "I was able to revise the entire Sainik School Math and GK syllabus in two months using the study notes here. Cleared on first attempt!",
    name: "Priya Sharma",
    school: "Sainik School Kodagu — 2023",
    initials: "PS",
  },
  {
    quote:
      "The leaderboard kept me motivated every day. Competing with other aspirants pushed me to study harder. Highly recommend for RMS preparation.",
    name: "Rahul Verma",
    school: "RMS Chail — 2023 Batch",
    initials: "RV",
  },
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
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 via-navy-900/65 to-background" />
          <div className="absolute bottom-0 left-0 right-0 h-1 flex">
            <div className="flex-1 bg-india-saffron" />
            <div className="flex-1 bg-india-white" />
            <div className="flex-1 bg-india-green" />
          </div>
        </div>

        <div className="relative container mx-auto px-4 py-24 md:py-36">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div variants={itemVariants} className="mb-5">
              <Badge className="bg-saffron-400/20 text-saffron-400 border-saffron-400/30 text-xs font-semibold tracking-wider uppercase px-3 py-1">
                <Shield className="w-3 h-3 mr-1.5" />
                India's Premier Military School Prep Platform
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            >
              Crack India's Top{" "}
              <span className="text-gradient-saffron">Military School</span>{" "}
              Exams
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-navy-100 mb-4 leading-relaxed max-w-2xl"
            >
              Structured preparation for{" "}
              <strong className="text-white">
                RIMC · Sainik School · RMS · Navodaya
              </strong>{" "}
              — with expert-curated questions, timed mock tests, and study notes
              designed for India's most competitive entrance exams.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-sm text-navy-300 mb-8"
            >
              Join 10,000+ students already preparing with us
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                className="bg-saffron-400 hover:bg-saffron-500 text-navy-900 font-bold text-base px-8 shadow-saffron border-0 h-12"
                onClick={() => onNavigate("practice")}
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Preparing — It's Free
              </Button>
              {!identity && (
                <Button
                  data-ocid="nav.login_button"
                  size="lg"
                  variant="outline"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent font-semibold text-base px-8 h-12"
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
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-navy-700">
            {STATS.map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center px-4"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-saffron-400" />
                  <span className="font-display font-bold text-3xl text-white">
                    {value}
                  </span>
                </div>
                <p className="text-navy-300 text-xs font-body uppercase tracking-wider">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Category Cards */}
      <section className="py-20 md:py-28 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-saffron-500 text-xs font-semibold uppercase tracking-widest mb-3">
            Choose Your Path
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Which Exam Are You{" "}
            <span className="text-gradient-saffron">Targeting?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Each exam has its own syllabus, pattern, and strategy. Pick yours
            and get a tailored preparation plan.
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

      {/* How It Works */}
      <section className="py-20 bg-secondary/40">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-saffron-500 text-xs font-semibold uppercase tracking-widest mb-3">
              Simple Process
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Three steps to systematic, confident exam preparation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {HOW_IT_WORKS.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] w-[calc(100%-1rem)] h-px bg-border" />
                )}
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-navy-800 border-2 border-saffron-400/40 mb-5 mx-auto">
                  <span className="font-display font-bold text-xl text-saffron-400">
                    {step}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
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

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-saffron-500 text-xs font-semibold uppercase tracking-widest mb-3">
              Platform Features
            </p>
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

      {/* Govt Jobs Promo Banner */}
      <section className="py-16 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          data-ocid="home.govtjobs.card"
          className="relative overflow-hidden rounded-2xl border border-navy-700/60"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.16 0.06 255) 0%, oklch(0.12 0.04 250) 50%, oklch(0.14 0.07 240) 100%)",
          }}
        >
          <div
            className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, oklch(0.55 0.15 145 / 0.12) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, oklch(0.75 0.18 50 / 0.08) 0%, transparent 70%)",
            }}
          />
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-emerald-400" />
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs font-semibold uppercase tracking-wider">
                    Career Pathways
                  </Badge>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
                  Plan Your Future:{" "}
                  <span className="text-emerald-400">Govt Job Pathways</span>
                </h2>
                <p className="text-navy-200 text-sm md:text-base leading-relaxed mb-5 max-w-xl">
                  Your military school preparation doesn't stop at the entrance
                  exam. It opens doors to NDA, UPSC, Agniveer, DRDO, Railways,
                  and dozens of prestigious government careers. Explore 15+
                  curated opportunities mapped to your qualification level.
                </p>
                <div className="flex flex-wrap gap-3 text-xs">
                  {[
                    {
                      label: "NDA & CDS",
                      color:
                        "text-saffron-400 bg-saffron-400/10 border-saffron-400/20",
                    },
                    {
                      label: "UPSC Civil Services",
                      color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
                    },
                    {
                      label: "Agniveer",
                      color:
                        "text-saffron-400 bg-saffron-400/10 border-saffron-400/20",
                    },
                    {
                      label: "DRDO & Railways",
                      color:
                        "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
                    },
                  ].map(({ label, color }) => (
                    <span
                      key={label}
                      className={`px-2.5 py-1 rounded-full border font-medium ${color}`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center md:items-end gap-3 md:min-w-[200px]">
                <div className="text-center md:text-right mb-1">
                  <p className="font-display font-bold text-5xl text-white">
                    15+
                  </p>
                  <p className="text-navy-300 text-sm">
                    govt job opportunities
                  </p>
                </div>
                <Button
                  data-ocid="home.govtjobs.primary_button"
                  size="lg"
                  onClick={() => onNavigate("govt-jobs")}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold border-0 px-8 w-full md:w-auto shadow-lg"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Explore Govt Jobs
                </Button>
                <p className="text-navy-400 text-xs text-center">
                  Free to browse, no signup required
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-saffron-500 text-xs font-semibold uppercase tracking-widest mb-3">
              Student Stories
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Students Who Made It
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Hear from aspirants who cleared their exams with Sainik Prep.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ quote, name, school, initials }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="bg-card rounded-2xl border border-border p-6 shadow-xs hover:shadow-card transition-shadow flex flex-col gap-4"
              >
                <div className="flex gap-1">
                  {"star-1 star-2 star-3 star-4 star-5"
                    .split(" ")
                    .map((starKey) => (
                      <Star
                        key={starKey}
                        className="w-4 h-4 fill-saffron-400 text-saffron-400"
                      />
                    ))}
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed flex-1 italic">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <div className="w-9 h-9 rounded-full bg-navy-800 border border-saffron-400/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-saffron-400">
                      {initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {name}
                    </p>
                    <p className="text-muted-foreground text-xs">{school}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Go Premium Banner */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          data-ocid="home.premium.card"
          className="relative overflow-hidden rounded-2xl border-2 border-saffron-400/50 p-8 md:p-12"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.18 0.07 255) 0%, oklch(0.14 0.05 250) 60%, oklch(0.16 0.06 280) 100%)",
          }}
        >
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, oklch(0.75 0.18 50 / 0.1) 0%, transparent 70%)",
            }}
          />
          <div className="relative flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-saffron-400" />
                <span className="font-display font-bold text-sm uppercase tracking-widest text-saffron-400">
                  Go Premium
                </span>
                <Badge className="bg-saffron-400 text-navy-900 text-[10px] font-bold px-2 py-0.5">
                  ₹499/yr
                </Badge>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
                Unlock the Full Prep Experience
              </h2>
              <p className="text-navy-200 text-sm md:text-base leading-relaxed mb-5 max-w-xl">
                Coaching centres charge ₹30,000/year for the same content. We
                charge ₹499. Complete access, zero compromise.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Unlimited mock tests & analytics",
                  "All past year question papers",
                  "Study notes for all 4 exams",
                  "Priority WhatsApp support",
                ].map((feat) => (
                  <li
                    key={feat}
                    className="flex items-center gap-2 text-sm text-navy-100"
                  >
                    <Check className="w-4 h-4 text-saffron-400 flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-center gap-3 md:min-w-[180px]">
              <div className="text-center mb-2">
                <p className="text-navy-300 text-xs mb-1 line-through">
                  ₹30,000 at coaching
                </p>
                <p className="font-display font-bold text-5xl text-white">
                  ₹499
                </p>
                <p className="text-saffron-400 text-sm font-semibold">
                  per year
                </p>
              </div>
              <Button
                data-ocid="home.premium.primary_button"
                size="lg"
                onClick={() => onNavigate("pricing")}
                className="bg-saffron-400 hover:bg-saffron-500 text-navy-900 font-bold border-0 px-8 w-full md:w-auto shadow-saffron"
              >
                <Crown className="w-4 h-4 mr-2" />
                View Plans
              </Button>
              <p className="text-navy-400 text-xs">
                7-day satisfaction guarantee
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      {!identity && (
        <section className="py-20 md:py-24 bg-military">
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
                leaderboard, and unlock personalised insights.
              </p>
              <Button
                size="lg"
                onClick={login}
                disabled={isLoggingIn}
                className="bg-saffron-400 hover:bg-saffron-500 text-navy-900 font-bold text-base px-10 border-0 shadow-saffron h-12"
              >
                <LogIn className="w-5 h-5 mr-2" />
                {isLoggingIn ? "Connecting..." : "Login with Internet Identity"}
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-navy-900">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-saffron-400/20 border border-saffron-400/30 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-saffron-400" />
                </div>
                <span className="font-display font-bold text-white text-lg">
                  Sainik Prep
                </span>
              </div>
              <p className="text-navy-300 text-sm leading-relaxed mb-4">
                Made for India's future defenders. The most affordable,
                effective prep platform for military school entrances.
              </p>
              <p className="text-saffron-400 text-xs font-semibold italic">
                "Discipline. Dedication. Defence."
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Practice Questions", page: "practice" as Page },
                  { label: "Mock Tests", page: "mock-tests" as Page },
                  { label: "Study Notes", page: "notes" as Page },
                  { label: "Leaderboard", page: "leaderboard" as Page },
                  { label: "Pricing", page: "pricing" as Page },
                  { label: "Govt Jobs", page: "govt-jobs" as Page },
                ].map(({ label, page }) => (
                  <li key={page}>
                    <button
                      type="button"
                      onClick={() => onNavigate(page)}
                      className="text-navy-300 hover:text-saffron-400 text-sm transition-colors"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exams */}
            <div>
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
                Exams Covered
              </h4>
              <ul className="space-y-2.5">
                {[
                  "RIMC — Rashtriya Indian Military College",
                  "Sainik School Entrance",
                  "RMS — Rashtriya Military School",
                  "Navodaya Vidyalaya (JNV)",
                ].map((item) => (
                  <li
                    key={item}
                    className="text-navy-300 text-sm flex items-start gap-2"
                  >
                    <Check className="w-3.5 h-3.5 text-saffron-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4">
                Contact & Support
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://wa.me/918091704118"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-navy-300 hover:text-saffron-400 text-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 flex-shrink-0" />
                    WhatsApp: 8091704118
                  </a>
                </li>
                <li className="flex items-center gap-2 text-navy-300 text-sm">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  Mon–Sat, 9am–6pm IST
                </li>
                <li>
                  <a
                    href="mailto:support@sainikprep.in"
                    className="flex items-center gap-2 text-navy-300 hover:text-saffron-400 text-sm transition-colors"
                  >
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    support@sainikprep.in
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="h-px w-full flex mb-6">
            <div className="flex-1 bg-india-saffron" />
            <div className="flex-1 bg-india-white/30" />
            <div className="flex-1 bg-india-green" />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-navy-400 text-xs text-center md:text-left">
              © {new Date().getFullYear()} Sainik Prep. All rights reserved.
            </p>
            <p className="text-navy-500 text-xs">
              Built with <span className="text-red-400">♥</span> using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-saffron-500 hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
