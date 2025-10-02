"use client";

import { IconCard } from "@/components/icon-card";
import { SearchAndFilter, ViewMode } from "@/components/search-and-filter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { IconData, useIconFilter } from "@/hooks/use-icon-filter";
import { Button } from "@headlessui/react";
import * as logoicon from "@logoicon/react";
import { metadata as iconMeta } from "@logoicon/react";
import { cn, pascalCase } from "@logoicon/util";
import { ArrowRightIcon, BlocksIcon, Palette, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ComponentType, useState } from "react";

const iconData: IconData[] = iconMeta
  .map((m) => {
    const exportName = pascalCase(m.title);
    const Comp = (logoicon as Record<string, unknown>)[exportName] as
      | ComponentType<{ className?: string }>
      | undefined;
    if (!Comp) return null;
    return {
      name: m.title,
      Component: Comp,
      category: m.category,
      brand: m.brand
    } as IconData;
  })
  .filter(Boolean) as IconData[];

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const {
    filteredIcons,
    categories,
    brands,
    totalCount,
    filteredCount,

    handleSearch,
    handleCategoryFilter,
    handleBrandFilter,
    handleSortChange,
    resetFilters
  } = useIconFilter(iconData);

  const handleViewChange = (view: ViewMode) => {
    setViewMode(view);
  };

  const iconSize = viewMode === "list" ? "md" : "sm";

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.section
        className="px-4 py-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="mb-4 bg-gradient-to-r from-gray-900 via-green-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent sm:text-6xl dark:from-white dark:via-green-400 dark:to-blue-400"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Beautiful Icons for
          <br />
          Modern Projects
        </motion.h1>

        <motion.p
          className="mx-auto mb-8 max-w-2xl text-xl text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Discover, search, and download high-quality SVG icons from top brands.
          Perfect for web, mobile, and desktop applications.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          className="mb-8 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Badge className="flex items-center gap-2 px-4 py-2">
            <Zap className="size-4 text-yellow-500" />
            Instant Search
          </Badge>
          <Badge className="flex items-center gap-2 px-4 py-2">
            <Palette className="size-4 text-blue-500" />
            SVG Format
          </Badge>
          <Badge className="flex items-center gap-2 px-4 py-2">
            <BlocksIcon className="size-4 text-green-500" />
            Easy Integration
          </Badge>
        </motion.div>
      </motion.section>

      {/* Search and Filter */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card>
          <CardContent>
            <SearchAndFilter
              onSearch={handleSearch}
              onCategoryFilter={handleCategoryFilter}
              onBrandFilter={handleBrandFilter}
              onSortChange={handleSortChange}
              onViewChange={handleViewChange}
              categories={categories}
              brands={brands}
              totalItems={totalCount}
              filteredItems={filteredCount}
            />
          </CardContent>
        </Card>
      </motion.section>

      {/* Results Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {/* No Results State */}
        <AnimatePresence mode="wait">
          {filteredCount === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-16 text-center"
            >
              <Card>
                <CardContent>
                  <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-stone-700">
                    <Palette className="size-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                    No icons found
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Try adjusting your search or filters to find what
                    you&apos;re looking for.
                  </p>
                  <Button
                    className="cursor-pointer focus:outline-none"
                    onClick={resetFilters}
                  >
                    Clear all filters
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            /* Icons Grid */
            <motion.div
              key="icons-grid"
              className={cn(
                "grid gap-4 transition-all duration-300",
                {
                  grid: "grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10",
                  list: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }[viewMode]
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnimatePresence mode="popLayout">
                {filteredIcons.map((icon, index) => (
                  <motion.div
                    key={icon.name}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(index * 0.02, 0.5)
                    }}
                  >
                    <IconCard
                      name={icon.name}
                      Component={icon.Component}
                      category={icon.category}
                      brand={icon.brand}
                      size={iconSize}
                      viewMode={viewMode}
                      className={cn(viewMode === "list")}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Load More Button (if needed) */}
      {filteredCount > 100 && (
        <motion.div
          className="container mx-auto flex w-full justify-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 p-2 hover:from-green-700 hover:to-blue-700">
            Load More Icons
            <ArrowRightIcon className="size-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
