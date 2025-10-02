"use client";

import { DarkMode } from "@/components/dark-mode";
import { Logo } from "@/components/layout/logo";
import { useMounted } from "@/hooks/use-mounted";
import { GithubIconDark, GithubIconLight } from "@logoicon/react";
import { cn } from "@logoicon/util";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [elevated, setElevated] = useState(false);
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setElevated(latest > 4);
  });

  return (
    <motion.header
      className={cn(
        "border-hero-200 sticky top-0 z-50 w-full rounded-none",
        elevated && [
          "supports-[backdrop-filter]:bg-hero-100 supports-[backdrop-filter]:backdrop-blur-xs",
          "dark:supports-[backdrop-filter]:bg-hero-700"
        ]
      )}
    >
      <div className="container mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <motion.div
            whileHover={{
              scale: 1.05,
              rotate: 2,
              transition: { type: "spring", stiffness: 300 }
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href="/">
              <Logo className="w-18" />
            </Link>
          </motion.div>

          {/* Actions */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* GitHub Button */}
            <Link
              href="https://github.com/dembilesmana/logoicon"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              {mounted &&
                {
                  light: <GithubIconLight className="size-6" />,
                  dark: <GithubIconDark className="size-6" />
                }[resolvedTheme ?? "light"]}
            </Link>

            {/* Dark Mode */}
            <DarkMode />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
