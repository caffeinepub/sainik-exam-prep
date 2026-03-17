import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronRight, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import type { Page } from "../types";

interface PaymentFailureProps {
  onNavigate: (page: Page) => void;
}

export function PaymentFailure({ onNavigate }: PaymentFailureProps) {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="bg-card rounded-2xl border border-border shadow-card p-10 max-w-md w-full text-center"
        data-ocid="payment.failure.card"
      >
        {/* Failure icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 18,
            delay: 0.15,
          }}
          className="flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 border-2 border-destructive/30 mx-auto mb-6"
        >
          <AlertCircle className="w-10 h-10 text-destructive" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
            Payment Cancelled
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-2">
            Your payment was not completed.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            No charges were made to your account. You can try again whenever
            you're ready — your cart details are saved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              data-ocid="payment.failure.primary_button"
              onClick={() => onNavigate("pricing")}
              className="bg-navy-800 hover:bg-saffron-400 hover:text-navy-900 text-white font-bold border-0 transition-all duration-300 h-11 px-6"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button
              data-ocid="payment.failure.secondary_button"
              variant="outline"
              onClick={() => onNavigate("home")}
              className="h-11 px-6 font-semibold"
            >
              Back to Home
            </Button>
          </div>
        </motion.div>
      </motion.div>

      <p className="text-xs text-muted-foreground mt-6">
        Need help? Reach us on WhatsApp for instant support.
      </p>
    </main>
  );
}
