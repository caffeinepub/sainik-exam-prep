import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight, GraduationCap } from "lucide-react";
import { motion } from "motion/react";
import type { Page } from "../types";

interface PaymentSuccessProps {
  onNavigate: (page: Page) => void;
}

export function PaymentSuccess({ onNavigate }: PaymentSuccessProps) {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="bg-card rounded-2xl border border-border shadow-card p-10 max-w-md w-full text-center"
        data-ocid="payment.success.card"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 18,
            delay: 0.15,
          }}
          className="flex items-center justify-center w-20 h-20 rounded-full bg-india-green/10 border-2 border-india-green/30 mx-auto mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-india-green" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-2">
            Welcome to{" "}
            <strong className="text-foreground">Sainik Prep Premium</strong>! 🎉
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            Your premium access has been activated. Unlimited mock tests, full
            study notes, and detailed analytics are now available to you.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              data-ocid="payment.success.primary_button"
              onClick={() => onNavigate("practice")}
              className="bg-navy-800 hover:bg-saffron-400 hover:text-navy-900 text-white font-bold border-0 transition-all duration-300 h-11 px-6"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Start Practising
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button
              data-ocid="payment.success.secondary_button"
              variant="outline"
              onClick={() => onNavigate("mock-tests")}
              className="h-11 px-6 font-semibold"
            >
              Take a Mock Test
            </Button>
          </div>
        </motion.div>
      </motion.div>

      <p className="text-xs text-muted-foreground mt-6">
        Your payment was processed securely via Razorpay.
      </p>
    </main>
  );
}
