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
    <button className="cursor-pointer" onClick={toggleTheme}>
      <motion.div
        className="flex items-center justify-center"
        transition={{ duration: 0.3 }}
        animate={{ rotate: { dark: 180, light: 0 }[resolvedTheme!] }}
      >
        {
          {
            dark: (
              <SunIcon className="size-6 fill-amber-400 stroke-amber-400" />
            ),
            light: <MoonIcon className="size-6 fill-gray-200 stroke-gray-200" />
          }[resolvedTheme!]
        }
      </motion.div>
    </button>
  );
}
