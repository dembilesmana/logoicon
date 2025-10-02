"use client";

import { useState, useMemo, useCallback } from "react";
import { SortOption, sortOptions } from "@/components/search-and-filter";

export interface IconData {
  name: string;
  Component: React.ComponentType<{ className?: string }>;
  category?: string;
  brand?: string;
}

export function useIconFilter(icons: IconData[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>(sortOptions[0]);

  // Extract unique categories and brands
  const { categories, brands } = useMemo(() => {
    const categorySet = new Set<string>();
    const brandSet = new Set<string>();

    icons.forEach((icon) => {
      if (icon.category) categorySet.add(icon.category);
      if (icon.brand) brandSet.add(icon.brand);
    });

    return {
      categories: Array.from(categorySet).sort(),
      brands: Array.from(brandSet).sort()
    };
  }, [icons]);

  // Filter and sort icons
  const filteredIcons = useMemo(() => {
    let filtered = icons;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (icon) =>
          icon.name.toLowerCase().includes(query) ||
          icon.category?.toLowerCase().includes(query) ||
          icon.brand?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (icon) => icon.category && selectedCategories.includes(icon.category)
      );
    }

    // Apply brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(
        (icon) => icon.brand && selectedBrands.includes(icon.brand)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOption.value) {
        case "asc":
          return a.name.localeCompare(b.name);
        case "desc":
          return b.name.localeCompare(a.name);
        case "category":
          return (a.category || "").localeCompare(b.category || "");
        case "brand":
          return (a.brand || "").localeCompare(b.brand || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [icons, searchQuery, selectedCategories, selectedBrands, sortOption]);

  // Handler functions
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCategoryFilter = useCallback((categories: string[]) => {
    setSelectedCategories(categories);
  }, []);

  const handleBrandFilter = useCallback((brands: string[]) => {
    setSelectedBrands(brands);
  }, []);

  const handleSortChange = useCallback((sort: SortOption) => {
    setSortOption(sort);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSortOption(sortOptions[0]);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery !== "" ||
      selectedCategories.length > 0 ||
      selectedBrands.length > 0
    );
  }, [searchQuery, selectedCategories, selectedBrands]);

  return {
    // Data
    filteredIcons,
    categories,
    brands,
    totalCount: icons.length,
    filteredCount: filteredIcons.length,

    // State
    searchQuery,
    selectedCategories,
    selectedBrands,
    sortOption,
    hasActiveFilters,

    // Handlers
    handleSearch,
    handleCategoryFilter,
    handleBrandFilter,
    handleSortChange,
    resetFilters
  };
}
