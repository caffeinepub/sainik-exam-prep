import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 12, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.9 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="pointer-events-none select-none rounded-full bg-[#1a1a1a] px-4 py-2 text-sm font-semibold text-white shadow-lg whitespace-nowrap"
            style={{ background: "rgba(20,20,20,0.92)" }}
          >
            Chat on WhatsApp
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href="https://wa.me/918091704118"
        target="_blank"
        rel="noopener noreferrer"
        data-ocid="whatsapp.button"
        aria-label="Chat on WhatsApp"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="flex h-14 w-14 items-center justify-center rounded-full shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/50"
        style={{ background: "#25D366" }}
      >
        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="28"
          height="28"
          fill="white"
          aria-hidden="true"
        >
          <path d="M16.002 2C8.268 2 2 8.268 2 16.002c0 2.478.658 4.873 1.906 6.978L2 30l7.214-1.889A13.93 13.93 0 0 0 16.002 30C23.735 30 30 23.732 30 16.002 30 8.268 23.735 2 16.002 2zm0 25.4a11.332 11.332 0 0 1-5.797-1.594l-.415-.248-4.28 1.12 1.143-4.163-.27-.428a11.326 11.326 0 0 1-1.733-6.085C4.65 9.668 9.67 4.65 16.002 4.65c3.068 0 5.954 1.194 8.12 3.362A11.41 11.41 0 0 1 27.35 16.002c0 6.333-5.02 11.398-11.348 11.398zm6.232-8.53c-.342-.17-2.02-1-2.336-1.113-.315-.114-.545-.17-.774.17-.23.34-.888 1.113-1.088 1.342-.2.228-.4.257-.742.086-.342-.17-1.44-.53-2.744-1.694-1.015-.906-1.7-2.024-1.9-2.366-.2-.342-.021-.527.15-.697.154-.154.342-.4.513-.598.17-.2.228-.342.342-.57.114-.228.057-.428-.028-.598-.086-.17-.775-1.872-1.06-2.562-.28-.672-.563-.58-.775-.59l-.66-.013c-.228 0-.598.086-.912.428-.314.342-1.2 1.17-1.2 2.853s1.228 3.31 1.4 3.54c.17.228 2.418 3.693 5.858 5.18.819.353 1.458.565 1.957.722.822.26 1.57.224 2.16.136.659-.098 2.02-.826 2.306-1.623.285-.797.285-1.48.2-1.623-.086-.142-.315-.228-.657-.4z" />
        </svg>
      </motion.a>
    </div>
  );
}
