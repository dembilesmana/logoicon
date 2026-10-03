"use client";

import { DarkMode } from "@/components/dark-mode";
import { useMounted } from "@/hooks/use-mounted";
import { config } from "@logoicon/config";
import { GithubIconDark, GithubIconLight, LogoiconLogo } from "@logoicon/react";
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
          "bg-hero-100",
          "dark:bg-hero-700",
          "backdrop-blur-xs",
          "supports-[backdrop-filter]:backdrop-blur-xs",
          "supports-[backdrop-filter]:bg-hero-100/60",
          "dark:supports-[backdrop-filter]:bg-hero-700/95",
          "dark:shadow-hero-900 shadow-hero-50 border-b-1 shadow-lg",
        ],
      )}
    >
      <div className="container mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <motion.div
            whileHover={{
              scale: 1.05,
              rotate: 2,
              transition: { type: "spring", stiffness: 300 },
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href="/">
              <LogoiconLogo className="w-16" />
            </Link>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <nav>
              <Link
                href={config.url.docs}
                className="text-hero-700 hover:text-hero-900 dark:text-hero-300 dark:hover:text-hero-100 font-bold"
              >
                Docs
              </Link>
            </nav>
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
                  dark: <GithubIconDark className="size-6" />,
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
