"use client";

import { useMounted } from "@/hooks/use-mounted";
import { GithubIconDark, GithubIconLight } from "@logoicon/react";
import { GlobeIcon, MailIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { AnchorHTMLAttributes, PropsWithChildren } from "react";
import { Logo } from "./logo";
import Link, { LinkProps } from "next/link";
import { cn } from "@logoicon/util";

function FooterLink(
  props: PropsWithChildren<LinkProps> & AnchorHTMLAttributes<HTMLAnchorElement>
) {
  const { children, className, ...z } = props;

  return (
    <Link
      {...z}
      className={cn(
        className,
        "text-stone-600 transition-colors hover:text-green-600 dark:text-stone-400 dark:hover:text-green-400"
      )}
    >
      {children}
    </Link>
  );
}

export function Footer() {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-16 w-full rounded-none border-t border-green-300 bg-stone-100 dark:border-green-700 dark:bg-stone-900"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Logo className="w-24" />
            </div>
            <p className="max-w-xs text-sm text-stone-600 transition-colors duration-300 dark:text-stone-300">
              A comprehensive React component library for beautiful brand logos
              and icons. Built with TypeScript and optimized for modern web
              applications.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800 transition-colors duration-300 dark:text-green-300">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <FooterLink
                  href="https://github.com/dembilesmana/logoicon"
                  className="text-sm text-stone-600 transition-colors hover:text-green-600 dark:text-stone-400 dark:hover:text-green-400"
                >
                  Documentation
                </FooterLink>
              </li>
              <li>
                <FooterLink
                  href="https://github.com/dembilesmana/logoicon/blob/main/README.md"
                  className="text-sm text-stone-600 transition-colors hover:text-green-600 dark:text-stone-400 dark:hover:text-green-400"
                >
                  Getting Started
                </FooterLink>
              </li>
              <li>
                <FooterLink
                  href="https://www.npmjs.com/package/@logoicon/react"
                  className="text-sm text-stone-600 transition-colors hover:text-green-600 dark:text-stone-400 dark:hover:text-green-400"
                >
                  NPM Package
                </FooterLink>
              </li>
              <li>
                <FooterLink
                  href="https://github.com/dembilesmana/logoicon/issues"
                  className="text-sm text-stone-600 transition-colors hover:text-green-600 dark:text-stone-400 dark:hover:text-green-400"
                >
                  Report Issues
                </FooterLink>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800 transition-colors duration-300 dark:text-green-300">
              Connect
            </h3>
            <div className="flex space-x-4">
              <FooterLink
                href="https://github.com/dembilesmana"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                {mounted &&
                  {
                    light: <GithubIconLight className="size-6" />,
                    dark: <GithubIconDark className="size-6" />
                  }[resolvedTheme ?? "light"]}
              </FooterLink>
              <FooterLink
                href="https://dembilesmana.vercel.app"
                aria-label="Website"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GlobeIcon className="size-6" />
              </FooterLink>
              <FooterLink
                href="mailto:dembilesmana@gmail.com"
                aria-label="Email"
              >
                <MailIcon className="size-6" />
              </FooterLink>
            </div>
            <p className="text-sm text-stone-600 transition-colors duration-300 dark:text-stone-300">
              {"Created with ❤️ by "}
              <FooterLink
                href="https://dembilesmana.vercel.app"
                className="font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                dembilesmana
              </FooterLink>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-center rounded-none border-t border-stone-300 pt-6 md:flex-row dark:border-stone-700">
          <p className="text-center text-sm text-stone-600 transition-colors duration-300 dark:text-stone-400">
            © {new Date().getFullYear()} logoicon. Open source under MIT
            License.
          </p>
          {/* <div className="mt-4 flex space-x-6 text-sm md:mt-0"> */}
          {/*   <FooterLink */}
          {/*     href="https://github.com/dembilesmana/logoicon/blob/main/LICENSE" */}
          {/*     target="_blank" */}
          {/*     rel="noopener noreferrer" */}
          {/*   > */}
          {/*     License */}
          {/*   </FooterLink> */}
          {/*   <FooterLink */}
          {/*     href="https://github.com/dembilesmana/logoicon/blob/main/CONTRIBUTING.md" */}
          {/*     target="_blank" */}
          {/*     rel="noopener noreferrer" */}
          {/*   > */}
          {/*     Contributing */}
          {/*   </FooterLink> */}
          {/*   <FooterLink */}
          {/*     href="https://github.com/dembilesmana/logoicon/releases" */}
          {/*     target="_blank" */}
          {/*     rel="noopener noreferrer" */}
          {/*   > */}
          {/*     Changelog */}
          {/*   </FooterLink> */}
          {/* </div> */}
        </div>
      </div>
    </motion.footer>
  );
}
