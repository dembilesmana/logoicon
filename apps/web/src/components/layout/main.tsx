"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";
import { Footer } from "./footer";

export function Main({ children }: { children: ReactNode }) {
  return (
    <>
      <motion.main
        className="container space-y-4 mx-auto max-w-xs md:max-w-2xl lg:max-w-md"
        style={{
          marginTop: "6rem",
        }}
      >
        {children}
      </motion.main>
      <Footer />
    </>
  );
}
