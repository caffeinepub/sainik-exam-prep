import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Check,
  ChevronRight,
  Crown,
  Loader2,
  Lock,
  Star,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRazorpayPayment } from "../hooks/useRazorpayPayment";
import type { Page } from "../types";
import { isRazorpayConfigured } from "../utils/razorpay";

interface PricingPageProps {
  onNavigate: (page: Page) => void;
}

const BASIC_FEATURES = [
  "Access to 5 practice questions per subject",
  "1 free mock test per month",
  "Basic study notes for RIMC & Sainik School",
  "Leaderboard access (view only)",
  "Community support",
];

const PREMIUM_FEATURES = [
  "Unlimited practice questions — all subjects",
  "Unlimited mock tests with timer & analytics",
  "Complete study notes for all 4 exams",
  "Detailed performance analytics & insights",
  "Priority WhatsApp support",
  "All past year question papers",
  "Rank improvement tracking",
];

export function PricingPage({ onNavigate }: PricingPageProps) {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { isPending, initiatePayment } = useRazorpayPayment();

  const isLoggedIn = !!identity;

  const handleGetPremium = async () => {
    if (!isLoggedIn) {
      toast.info("Please log in to upgrade to Premium");
      login();
      return;
    }

    if (!isRazorpayConfigured()) {
      toast.error("Payments are not configured yet. Please contact the admin.");
      return;
    }

    try {
      await initiatePayment({
        amount: 499,
        currency: "INR",
        name: "Sainik Prep",
        description: "Premium Annual Plan",
        prefill: {},
      });
      onNavigate("payment-success");
    } catch {
      toast.error("Payment was cancelled or failed. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Hero header */}
      <div className="bg-military border-b border-navy-700/50">
        <div className="container mx-auto px-4 py-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-saffron-400/20 text-saffron-400 border-saffron-400/30 text-xs px-3 py-1">
              <Star className="w-3 h-3 mr-1.5 inline" />
              Simple Pricing
            </Badge>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
              Invest in Your{" "}
              <span className="text-gradient-saffron">Defence Future</span>
            </h1>
            <p className="text-navy-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Everything you need to crack RIMC, Sainik School, RMS &amp;
              Navodaya exams — at a price that's a fraction of coaching fees.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="container mx-auto px-4 py-14 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Basic Plan */}
          <motion.div
            data-ocid="pricing.basic.card"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="bg-card rounded-2xl border border-border shadow-card p-8 relative"
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
                <span className="font-display font-semibold text-sm uppercase tracking-widest text-muted-foreground">
                  Basic
                </span>
              </div>
              <div className="flex items-end gap-1 mb-1">
                <span className="font-display text-5xl font-bold text-foreground">
                  Free
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Get started at no cost
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {BASIC_FEATURES.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-india-green mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/80">{feat}</span>
                </li>
              ))}
            </ul>

            <Button
              data-ocid="pricing.basic.primary_button"
              variant="outline"
              className="w-full h-11 font-semibold border-border hover:border-primary hover:bg-secondary transition-all"
              onClick={() => onNavigate("practice")}
            >
              Start for Free
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            data-ocid="pricing.premium.card"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="relative"
          >
            {/* Recommended badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <Badge className="bg-saffron-400 text-navy-900 font-bold px-4 py-1 text-xs shadow-saffron">
                <Crown className="w-3 h-3 mr-1.5 inline" />
                Most Popular
              </Badge>
            </div>

            <div
              className="rounded-2xl border-2 border-saffron-400 shadow-saffron p-8 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(145deg, oklch(0.18 0.07 255) 0%, oklch(0.14 0.05 250) 100%)",
              }}
            >
              {/* Decorative glow */}
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.75 0.18 50 / 0.12) 0%, transparent 70%)",
                }}
              />

              <div className="mb-6 relative">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-saffron-400" />
                  <span className="font-display font-semibold text-sm uppercase tracking-widest text-saffron-400">
                    Premium
                  </span>
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <span className="font-display text-5xl font-bold text-white">
                    ₹499
                  </span>
                  <span className="text-navy-300 text-base mb-2">/year</span>
                </div>
                <p className="text-navy-300 text-sm">
                  Less than ₹42/month — complete exam prep
                </p>
              </div>

              <ul className="space-y-3 mb-8 relative">
                {PREMIUM_FEATURES.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-saffron-400 mt-0.5 flex-shrink-0" />
                    <span className="text-navy-100">{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Login prompt if not logged in */}
              {!isLoggedIn && (
                <div
                  data-ocid="pricing.login.error_state"
                  className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-saffron-400/10 border border-saffron-400/20 text-saffron-300 text-xs"
                >
                  <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                  Login is required to complete your purchase
                </div>
              )}

              <Button
                data-ocid="pricing.premium.primary_button"
                disabled={isPending || isLoggingIn}
                onClick={handleGetPremium}
                className="w-full h-12 font-bold text-base bg-saffron-400 hover:bg-saffron-500 text-navy-900 border-0 shadow-saffron transition-all duration-300 relative"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span data-ocid="pricing.premium.loading_state">
                      Processing payment…
                    </span>
                  </>
                ) : isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in…
                  </>
                ) : !isLoggedIn ? (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Login &amp; Get Premium
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 mr-2" />
                    Get Premium — ₹499/year
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-navy-400 mt-3">
                Secure payment via Razorpay · Instant access
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {[
                  "UPI",
                  "Visa / Mastercard",
                  "RuPay",
                  "Net Banking",
                  "Wallets",
                ].map((method) => (
                  <span
                    key={method}
                    className="text-xs bg-white/10 text-navy-200 rounded-full px-3 py-0.5 border border-white/10"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Comparison note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <p className="text-muted-foreground text-sm mb-2">
            Coaching centres charge ₹20,000–₹50,000/year for the same content.
          </p>
          <p className="font-display font-semibold text-foreground text-base">
            Sainik Prep gives you everything at{" "}
            <span className="text-gradient-saffron">99% less cost.</span>
          </p>
        </motion.div>

        {/* FAQ strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              q: "Which exams are covered?",
              a: "RIMC (Rashtriya Indian Military College), Sainik School, Rashtriya Military School (RMS), and Jawahar Navodaya Vidyalaya (JNV).",
            },
            {
              q: "Can I cancel anytime?",
              a: "Premium is an annual subscription. You retain access for the full year regardless of when you purchase.",
            },
            {
              q: "Which payment methods are accepted?",
              a: "UPI (Google Pay, PhonePe, Paytm), Visa/Mastercard/RuPay cards, Net Banking, and digital wallets — all processed securely via Razorpay, fully supported and legal in India.",
            },
          ].map(({ q, a }) => (
            <div
              key={q}
              className="bg-card rounded-xl border border-border p-5 text-sm"
            >
              <p className="font-semibold text-foreground mb-1.5">{q}</p>
              <p className="text-muted-foreground leading-relaxed">{a}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer note */}
      <div className="text-center mt-4 pb-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="underline hover:text-foreground transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </main>
  );
}
