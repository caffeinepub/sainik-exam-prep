import { useState } from "react";
import { getRazorpayKeyId, loadRazorpayScript } from "../utils/razorpay";

interface RazorpayWindow extends Window {
  Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
  theme: {
    color: string;
  };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface InitiatePaymentOptions {
  amount: number; // in INR
  currency: string;
  name: string;
  description: string;
  prefill?: {
    name?: string;
    email?: string;
  };
}

interface PaymentResult {
  payment_id: string;
}

export function useRazorpayPayment() {
  const [isPending, setIsPending] = useState(false);

  const initiatePayment = async (
    options: InitiatePaymentOptions,
  ): Promise<PaymentResult> => {
    setIsPending(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error("Failed to load Razorpay SDK");
      }

      const keyId = getRazorpayKeyId();
      if (!keyId) {
        throw new Error("Razorpay Key ID not configured");
      }

      return await new Promise<PaymentResult>((resolve, reject) => {
        const rzpOptions: RazorpayOptions = {
          key: keyId,
          amount: options.amount * 100, // convert INR to paise
          currency: options.currency || "INR",
          name: options.name,
          description: options.description,
          handler: (response: RazorpayResponse) => {
            resolve({ payment_id: response.razorpay_payment_id });
          },
          modal: {
            ondismiss: () => {
              reject(new Error("Payment dismissed by user"));
            },
          },
          theme: {
            color: "#F59E0B",
          },
        };

        const RazorpayConstructor = (window as unknown as RazorpayWindow)
          .Razorpay;
        const rzp = new RazorpayConstructor(rzpOptions);
        rzp.open();
      });
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, initiatePayment };
}
