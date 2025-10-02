"use client";

import { Button } from "@headlessui/react";
import { cn } from "@logoicon/util";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ViewMode } from "./search-and-filter";
import { Card } from "./ui/card";
import { CopyIcon, DownloadIcon } from "lucide-react";

interface IconCardProps {
  name: string;
  Component: React.ComponentType<{ className?: string }>;
  category?: string;
  brand?: string;
  size?: "sm" | "md";
  showActions?: boolean;
  className?: string;
  viewMode?: ViewMode;
}

export function IconCard({
  name,
  Component,
  // category,
  brand,
  size = "md",
  // showActions = true,
  className,
  viewMode = "grid"
}: IconCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const componentCode = `<${name.charAt(0).toUpperCase() + name.slice(1)} className="size-6" />`;
      await navigator.clipboard.writeText(componentCode);
      setIsCopied(true);
      toast.success("Component code copied to clipboard!");

      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownload = () => {
    // This would typically generate and download the SVG
    toast.success("Icon downloaded!");
  };

  const cleanName = name.replace(/([A-Z])/g, " $1").trim();

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("group relative", className)}
    >
      {/* Download Copy */}
      {
        <motion.div
          initial={
            {
              grid: { opacity: 0 },
              list: { opacity: 0 }
            }[viewMode]
          }
          animate={
            {
              grid: {
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : -10
              },
              list: {
                opacity: isHovered ? 1 : 0,
                x: isHovered ? 0 : 20
              }
            }[viewMode]
          }
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div
            className={cn(
              "flex items-center justify-between",
              {
                grid: "size-full flex-row items-center",
                list: "h-full flex-col items-start"
              }[viewMode]
            )}
          >
            <Button
              className="hover:bg-hero-100 cursor-pointer p-2 group-hover:border"
              onClick={handleCopy}
            >
              <CopyIcon className="size-4" />
            </Button>

            <Button
              className="hover:bg-hero-100 cursor-pointer p-2 group-hover:border"
              onClick={handleDownload}
            >
              <DownloadIcon className="size-4" />
            </Button>
          </div>
        </motion.div>
      }

      {/* INFO:  Card */}
      <motion.div
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 10
        }}
        animate={
          {
            grid: {
              scale: isHovered ? 1.1 : 1,
              y: isHovered ? "-3.5rem" : 0,
              width: "100%"
            },
            list: {
              x: isHovered ? "2.5rem" : "0rem",
              width: isHovered ? "calc(100% - 2.5rem)" : "100%"
            }
          }[viewMode]
        }
        className={"group:hover:z-50 relative will-change-transform"}
      >
        <Card
          className={cn(
            "relative p-0 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-500/20",
            viewMode === "list" && "grid grid-cols-[8rem_1fr] flex-row"
          )}
        >
          {/* INFO: Icon Display Area */}
          <div
            className={"relative flex flex-col items-center justify-center p-4"}
          >
            {/* Icon */}
            <motion.div
              className="flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Component
                className={cn(
                  {
                    sm: "min-h-6 max-w-full",
                    md: "min-h-12 max-w-full"
                  }[size],
                  "transition-colors duration-200",
                  "drop-shadow group-hover:text-green-600 dark:group-hover:text-green-400"
                )}
              />
            </motion.div>
          </div>

          {/* INFO: Icon Name */}
          {viewMode === "list" && (
            <div className="overflow-hidden p-4">
              <h3 className="max-w-full truncate text-gray-900 dark:text-gray-100">
                <span className="truncate">{cleanName}</span>
              </h3>
              {brand && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {brand}
                </p>
              )}
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
