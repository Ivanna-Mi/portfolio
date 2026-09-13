"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function IntroOverlay() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(false), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
        >
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-0 z-10 h-[60%] overflow-hidden border-b border-white/5 md:h-[87.5%]"
          >
            <img
              src="/head-letter.svg"
              alt=""
              className="h-full w-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ y: 0 }}
            animate={{ y: "100%" }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.05,
            }}
            className="absolute inset-0 overflow-hidden border-t border-white/5"
          >
            <img
              src="/bottom-letter.svg"
              alt=""
              className="h-full w-full object-cover"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
