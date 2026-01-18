"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function DarkMode() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      return setTheme("light");
    } else {
      return setTheme("dark");
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // atau skeleton icon supaya tidak blank
  }

  return (
    <>
      <button
        type="button"
        aria-label="Toggle theme"
        onClick={toggleTheme}
        className="relative flex items-center justify-center rounded-md"
      >
        <motion.div
          className="relative size-6"
          animate={resolvedTheme}
          variants={{
            light: { rotate: 0 },
            dark: { rotate: 180 }
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Sun (action when dark) */}
          <motion.span
            className="absolute inset-0"
            variants={{
              light: { opacity: 0, scale: 0.5 },
              dark: { opacity: 1, scale: 1 }
            }}
            transition={{ duration: 0.2 }}
          >
            <SunIcon className="size-6 fill-amber-400 stroke-amber-400" />
          </motion.span>

          {/* Moon (action when light) */}
          <motion.span
            className="absolute inset-0"
            variants={{
              light: { opacity: 1, scale: 1 },
              dark: { opacity: 0, scale: 0.5 }
            }}
            transition={{ duration: 0.2 }}
          >
            <MoonIcon className="size-6 fill-gray-200 stroke-gray-200" />
          </motion.span>
        </motion.div>
      </button>
    </>
  );
}
