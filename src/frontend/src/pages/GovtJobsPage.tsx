import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Calendar,
  ExternalLink,
  GraduationCap,
  Shield,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type JobCategory = "defence" | "paramilitary" | "civil";

interface GovtJob {
  id: number;
  title: string;
  organization: string;
  eligibilityAge: string;
  eligibilityEdu: string;
  notificationMonth: string;
  category: JobCategory;
  officialUrl: string;
  highlight?: boolean;
}

const JOBS: GovtJob[] = [
  {
    id: 1,
    title: "NDA — National Defence Academy",
    organization: "UPSC",
    eligibilityAge: "16.5 – 19.5 years",
    eligibilityEdu: "10+2 or appearing",
    notificationMonth: "Twice/year (Jan & Jun)",
    category: "defence",
    officialUrl: "https://upsc.gov.in",
    highlight: true,
  },
  {
    id: 2,
    title: "Agniveer (Army / Navy / Air Force)",
    organization: "Ministry of Defence",
    eligibilityAge: "17.5 – 21 years",
    eligibilityEdu: "10th / 10+2",
    notificationMonth: "Annual",
    category: "defence",
    officialUrl: "https://agnipathscheme.gov.in",
    highlight: true,
  },
  {
    id: 3,
    title: "Indian Army Technical Entry Scheme",
    organization: "Indian Army",
    eligibilityAge: "16.5 – 19.5 years",
    eligibilityEdu: "10+2 with PCM",
    notificationMonth: "Twice/year",
    category: "defence",
    officialUrl: "https://joinindianarmy.nic.in",
    highlight: true,
  },
  {
    id: 4,
    title: "CDS — Combined Defence Services",
    organization: "UPSC",
    eligibilityAge: "19 – 24 years",
    eligibilityEdu: "Graduate",
    notificationMonth: "Twice/year (Oct & May)",
    category: "defence",
    officialUrl: "https://upsc.gov.in",
    highlight: true,
  },
  {
    id: 5,
    title: "AFCAT — Air Force Common Admission Test",
    organization: "Indian Air Force",
    eligibilityAge: "20 – 26 years",
    eligibilityEdu: "Graduate",
    notificationMonth: "Twice/year",
    category: "defence",
    officialUrl: "https://afcat.cdac.in",
  },
  {
    id: 6,
    title: "Indian Navy SSR / AA",
    organization: "Indian Navy",
    eligibilityAge: "17 – 20 years",
    eligibilityEdu: "10+2 with PCM",
    notificationMonth: "Rolling notifications",
    category: "defence",
    officialUrl: "https://www.joinindiannavy.gov.in",
  },
  {
    id: 7,
    title: "Coast Guard Navik (GD)",
    organization: "Indian Coast Guard",
    eligibilityAge: "18 – 22 years",
    eligibilityEdu: "10+2",
    notificationMonth: "Periodic",
    category: "defence",
    officialUrl: "https://joinindiancoastguard.cdac.in",
  },
  {
    id: 8,
    title: "CAPF AC — Central Armed Police Forces",
    organization: "UPSC / MHA",
    eligibilityAge: "20 – 25 years",
    eligibilityEdu: "Graduate",
    notificationMonth: "Annual (May)",
    category: "paramilitary",
    officialUrl: "https://upsc.gov.in",
    highlight: true,
  },
  {
    id: 9,
    title: "SSC GD Constable",
    organization: "Staff Selection Commission",
    eligibilityAge: "18 – 23 years",
    eligibilityEdu: "10th pass",
    notificationMonth: "Periodic",
    category: "paramilitary",
    officialUrl: "https://ssc.gov.in",
  },
  {
    id: 10,
    title: "BSF / CISF / CRPF Constable",
    organization: "Ministry of Home Affairs",
    eligibilityAge: "18 – 23 years",
    eligibilityEdu: "10th pass",
    notificationMonth: "Periodic",
    category: "paramilitary",
    officialUrl: "https://mha.gov.in",
  },
  {
    id: 11,
    title: "Indian Railways — Group D / NTPC",
    organization: "Railway Recruitment Board",
    eligibilityAge: "18 – 30 years",
    eligibilityEdu: "10th / 12th",
    notificationMonth: "Periodic",
    category: "civil",
    officialUrl: "https://rrbcdg.gov.in",
  },
  {
    id: 12,
    title: "State Police Constable / Sub-Inspector",
    organization: "State Governments",
    eligibilityAge: "18 – 25 years",
    eligibilityEdu: "10th / 12th",
    notificationMonth: "Periodic",
    category: "civil",
    officialUrl: "https://www.india.gov.in/topics/law-justice/state-police",
  },
  {
    id: 13,
    title: "DRDO Apprentice / Scientist B",
    organization: "DRDO",
    eligibilityAge: "18 – 28 years",
    eligibilityEdu: "Graduate / B.Tech",
    notificationMonth: "Annual",
    category: "civil",
    officialUrl: "https://rac.gov.in",
  },
  {
    id: 14,
    title: "UPSC Civil Services (IAS / IPS / IFS)",
    organization: "UPSC",
    eligibilityAge: "21 – 32 years",
    eligibilityEdu: "Graduate",
    notificationMonth: "Annual (Feb)",
    category: "civil",
    officialUrl: "https://upsc.gov.in",
    highlight: true,
  },
  {
    id: 15,
    title: "SSC CGL — Combined Graduate Level",
    organization: "Staff Selection Commission",
    eligibilityAge: "18 – 30 years",
    eligibilityEdu: "Graduate",
    notificationMonth: "Annual",
    category: "civil",
    officialUrl: "https://ssc.gov.in",
  },
];

const CATEGORY_CONFIG: Record<
  JobCategory,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  defence: {
    label: "Defence",
    color: "text-saffron-600",
    bgColor: "bg-saffron-400/15",
    borderColor: "border-saffron-400/40",
  },
  paramilitary: {
    label: "Paramilitary",
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/15",
    borderColor: "border-emerald-500/40",
  },
  civil: {
    label: "Civil Services",
    color: "text-blue-600",
    bgColor: "bg-blue-500/15",
    borderColor: "border-blue-500/40",
  },
};

const FILTER_OPTIONS: { value: "all" | JobCategory; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "defence", label: "🪖 Defence" },
  { value: "paramilitary", label: "🛡️ Paramilitary" },
  { value: "civil", label: "🏛️ Civil Services" },
];

export function GovtJobsPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | JobCategory>("all");

  const filtered =
    activeFilter === "all"
      ? JOBS
      : JOBS.filter((j) => j.category === activeFilter);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-military relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 70% 50%, oklch(0.75 0.18 50 / 0.08) 0%, transparent 65%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-india-saffron" />
          <div className="flex-1 bg-india-white" />
          <div className="flex-1 bg-india-green" />
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-saffron-400/20 border border-saffron-400/30 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-saffron-400" />
              </div>
              <Badge className="bg-saffron-400/20 text-saffron-400 border-saffron-400/30 text-xs font-semibold uppercase tracking-wider">
                Career Pathways
              </Badge>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
              Government Job{" "}
              <span className="text-gradient-saffron">Opportunities</span>
            </h1>
            <p className="text-navy-200 text-lg leading-relaxed max-w-2xl mb-6">
              Your Sainik School, RIMC, or RMS education is the foundation.
              These are the doors it opens — from NDA and UPSC to Railways and
              DRDO. Plan your career path early and prepare with purpose.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-navy-300">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-saffron-400" />
                <span>7 Defence jobs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>3 Paramilitary jobs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <span>5 Civil Service jobs</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border shadow-xs">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                data-ocid={`govtjobs.${value}.tab`}
                onClick={() => setActiveFilter(value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  activeFilter === value
                    ? "bg-saffron-400 text-navy-900 border-saffron-400 font-semibold"
                    : "bg-transparent text-muted-foreground border-border hover:border-saffron-400/50 hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Job Cards */}
      <section className="container mx-auto px-4 py-12">
        {/* Defence highlight note */}
        {(activeFilter === "all" || activeFilter === "defence") && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-xl bg-saffron-400/10 border border-saffron-400/30 flex items-start gap-3"
          >
            <Star className="w-5 h-5 text-saffron-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/80">
              <strong className="text-foreground">
                Military school students have an edge:
              </strong>{" "}
              RIMC, Sainik School, and RMS alumni are preferred candidates for
              NDA, CDS, and Agniveer — your school life is direct preparation
              for these exams.
            </p>
          </motion.div>
        )}

        <div
          data-ocid="govtjobs.list"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {filtered.map((job, idx) => {
            const cfg = CATEGORY_CONFIG[job.category];
            return (
              <motion.div
                key={job.id}
                data-ocid={`govtjobs.item.${idx + 1}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className={`group bg-card rounded-xl border shadow-xs hover:shadow-card transition-all duration-300 flex flex-col ${
                  job.highlight
                    ? "border-saffron-400/40 ring-1 ring-saffron-400/20"
                    : "border-border"
                }`}
              >
                {/* Top accent bar */}
                <div
                  className={`h-1 rounded-t-xl ${
                    job.category === "defence"
                      ? "bg-gradient-to-r from-saffron-400 to-saffron-500"
                      : job.category === "paramilitary"
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                        : "bg-gradient-to-r from-blue-500 to-blue-600"
                  }`}
                />

                <div className="p-5 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-foreground text-base leading-snug mb-1">
                        {job.title}
                        {job.highlight && (
                          <Star className="inline w-3.5 h-3.5 text-saffron-400 ml-1.5 fill-saffron-400" />
                        )}
                      </h3>
                      <p className="text-muted-foreground text-xs font-medium">
                        {job.organization}
                      </p>
                    </div>
                    <Badge
                      className={`flex-shrink-0 text-[10px] font-semibold border ${
                        cfg.bgColor
                      } ${cfg.color} ${cfg.borderColor}`}
                    >
                      {cfg.label}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground text-xs w-20 flex-shrink-0 font-semibold uppercase tracking-wide">
                        Age
                      </span>
                      <span className="text-foreground text-xs">
                        {job.eligibilityAge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground text-xs w-20 flex-shrink-0 font-semibold uppercase tracking-wide">
                        Education
                      </span>
                      <span className="text-foreground text-xs">
                        {job.eligibilityEdu}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground text-xs">
                        {job.notificationMonth}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    data-ocid={`govtjobs.item.${idx + 1}.button`}
                    size="sm"
                    variant="outline"
                    className={`w-full gap-1.5 text-xs font-semibold transition-all duration-200 group-hover:border-saffron-400/60 group-hover:text-saffron-600 ${
                      job.highlight
                        ? "border-saffron-400/40 text-saffron-600"
                        : ""
                    }`}
                    onClick={() => window.open(job.officialUrl, "_blank")}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Apply / Official Site
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div
            data-ocid="govtjobs.empty_state"
            className="text-center py-20 text-muted-foreground"
          >
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-display font-semibold text-lg">No jobs found</p>
            <p className="text-sm mt-1">Try a different category filter.</p>
          </div>
        )}
      </section>

      {/* Disclaimer */}
      <section className="container mx-auto px-4 pb-12">
        <div className="rounded-xl bg-secondary/50 border border-border p-5 text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Disclaimer:</strong> Job details
          such as age limits, eligibility, and notification schedules are
          indicative and subject to change. Always verify the latest information
          on the official recruitment portal before applying.
        </div>
      </section>
    </main>
  );
}
