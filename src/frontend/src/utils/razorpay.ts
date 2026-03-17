// Loads Razorpay checkout.js SDK if not already loaded
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (
      typeof window !== "undefined" &&
      (window as unknown as { Razorpay?: unknown }).Razorpay
    ) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function getRazorpayKeyId(): string | null {
  return localStorage.getItem("razorpay_key_id");
}

export function setRazorpayKeyId(keyId: string): void {
  localStorage.setItem("razorpay_key_id", keyId);
}

export function clearRazorpayKeyId(): void {
  localStorage.removeItem("razorpay_key_id");
}

export function isRazorpayConfigured(): boolean {
  const key = getRazorpayKeyId();
  return !!key && (key.startsWith("rzp_test_") || key.startsWith("rzp_live_"));
}
