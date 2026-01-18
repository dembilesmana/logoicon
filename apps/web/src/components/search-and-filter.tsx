"use client";

import { Badge } from "@/components/ui/badge";
import {
  Button,
  Field,
  Input,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from "@headlessui/react";
import { cn } from "@logoicon/util";
import {
  ArrowDownAzIcon,
  ArrowUpAZIcon,
  BoxIcon,
  FunnelIcon,
  LayoutGridIcon,
  LayoutListIcon,
  SearchIcon,
  TagIcon,
  XIcon
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  ComponentProps,
  FC,
  Fragment,
  SVGProps,
  useCallback,
  useMemo,
  useState
} from "react";
import { Card, CardContent } from "./ui/card";

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (categories: string[]) => void;
  onBrandFilter: (brands: string[]) => void;
  onSortChange: (sort: SortOption) => void;
  onViewChange: (view: ViewMode) => void;
  categories: string[];
  brands: string[];
  totalItems: number;
  filteredItems: number;
  className?: string;
}

export type SortOptionValue = "asc" | "desc" | "category" | "brand";
export type SortOptionLabel = "Name A-Z" | "Name Z-A" | "Category" | "Brand";
export type ViewMode = "grid" | "list";
export type SortOption = {
  value: SortOptionValue;
  label: SortOptionLabel;
  icon: FC<SVGProps<SVGSVGElement>>;
};
type BadgeFiltersProps = {
  markCross?: boolean;
} & ComponentProps<"span">;

export const sortOptions: SortOption[] = [
  {
    value: "asc",
    label: "Name A-Z",
    icon: ArrowDownAzIcon
  },
  {
    value: "desc",
    label: "Name Z-A",
    icon: ArrowUpAZIcon
  },
  {
    value: "category",
    label: "Category",
    icon: TagIcon
  },
  {
    value: "brand",
    label: "Brand",
    icon: BoxIcon
  }
];

export function SearchAndFilter({
  onSearch,
  onCategoryFilter,
  onBrandFilter,
  onSortChange,
  onViewChange,
  categories,
  brands,
  totalItems,
  filteredItems,
  className
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [currentSort, setCurrentSort] = useState(sortOptions[0]);
  const [currentView, setCurrentView] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      onSearch(value);
    },
    [onSearch]
  );

  const handleCategoryToggle = useCallback(
    (category: string) => {
      const newCategories = selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category];

      setSelectedCategories(newCategories);
      onCategoryFilter(newCategories);
    },
    [selectedCategories, onCategoryFilter]
  );

  const handleBrandToggle = useCallback(
    (brand: string) => {
      const newBrands = selectedBrands.includes(brand)
        ? selectedBrands.filter((b) => b !== brand)
        : [...selectedBrands, brand];

      setSelectedBrands(newBrands);
      onBrandFilter(newBrands);
    },
    [selectedBrands, onBrandFilter]
  );

  const handleSortChange = useCallback(
    (sort: SortOption) => {
      setCurrentSort(sort);
      onSortChange(sort);
    },
    [onSortChange]
  );

  const handleViewChange = useCallback(
    (view: ViewMode) => {
      setCurrentView(view);
      onViewChange(view);
    },
    [onViewChange]
  );

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    onSearch("");
    onCategoryFilter([]);
    onBrandFilter([]);
  }, [onSearch, onCategoryFilter, onBrandFilter]);

  const activeFiltersCount =
    selectedCategories.length + selectedBrands.length + (searchQuery ? 1 : 0);

  const topCategories = useMemo(() => categories.slice(0, 8), [categories]);

  const topBrands = useMemo(() => brands.slice(0, 12), [brands]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Search and Controls */}
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Search Input */}
        <Field className="relative flex flex-1 items-center gap-2 border px-4 py-2 focus-within:outline-2 focus-within:outline-green-200">
          <Label>
            <SearchIcon className="size-4" />
          </Label>
          <Input
            className="pr-6"
            type="text"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />

          {searchQuery && (
            <button
              tabIndex={-1}
              onClick={() => handleSearchChange("")}
              className="group absolute top-1/2 right-2 -translate-y-1/2 transform cursor-pointer transition-colors"
            >
              <XIcon className="size-4 group-hover:stroke-3" />
            </button>
          )}
        </Field>

        {/* Filter Toggle */}
        <Button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 border px-4 py-2 focus:outline-2 focus:outline-green-200",
            showFilters && "bg-green-200"
          )}
        >
          <FunnelIcon className="size-4" />
          Filters
        </Button>

        <div className="flex justify-between gap-4">
          {/* Sort Dropdown */}
          <Listbox value={currentSort} onChange={handleSortChange}>
            {({ open }) => (
              <>
                <ListboxButton
                  className={cn(
                    "flex items-center gap-2 border p-2 whitespace-nowrap focus:outline-2 focus:outline-green-200",
                    open && "bg-green-200 outline-2 outline-green-200"
                  )}
                >
                  {currentSort.label}
                  <currentSort.icon className="size-4" />
                </ListboxButton>
                <ListboxOptions
                  className="bg-hero-50 space-y-1 border p-2 focus:outline-green-200"
                  anchor={{ to: "bottom", gap: "0.5rem" }}
                >
                  {sortOptions.map((options) => (
                    <ListboxOption
                      as={Fragment}
                      value={options}
                      key={options.value}
                    >
                      {({ focus, selected }) => (
                        <div
                          className={cn(
                            "flex items-center justify-between gap-2 rounded-sm px-4 py-2",
                            focus && "bg-hero-100",
                            selected && "bg-hero-200"
                          )}
                        >
                          {options.label}
                          <options.icon className="size-4" />
                        </div>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </>
            )}
          </Listbox>

          {/* View Toggle */}
          <div className="flex flex-row overflow-hidden rounded-md border focus-within:outline-2 focus-within:outline-green-200">
            <Button
              onClick={() => handleViewChange("grid")}
              className={cn(
                currentView === "grid" && "bg-green-200 text-green-50",
                "group-focus:bg-hero-200 rounded-none p-2 focus:bg-green-100 focus:outline-none"
              )}
            >
              <LayoutGridIcon />
            </Button>
            <Button
              onClick={() => handleViewChange("list")}
              className={cn(
                currentView === "list" && "bg-green-200 stroke-white",
                "group-focus:bg-hero-200 rounded-none p-2 focus:bg-green-100 focus:outline-none"
              )}
            >
              <LayoutListIcon />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <span>
          Showing {filteredItems.toLocaleString()} of{" "}
          {totalItems.toLocaleString()} icons
        </span>
        {activeFiltersCount > 0 && (
          <Button
            onClick={clearAllFilters}
            className="cursor-pointer focus:outline-none"
          >
            Clear all filters
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Card>
              <CardContent className="space-y-4 p-4">
                {/* Category Filters */}
                <div>
                  <h3 className="mb-3 text-sm font-medium">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {topCategories.map((category) => (
                      <BadgeFilters
                        key={category}
                        className="cursor-pointer transition-all hover:shadow-sm"
                        onClick={() => handleCategoryToggle(category)}
                        markCross={selectedCategories.includes(category)}
                      >
                        {category}
                      </BadgeFilters>
                    ))}
                    {categories.length > 8 && (
                      <Badge>+{categories.length - 8} more</Badge>
                    )}
                  </div>
                </div>

                {/* Brand Filters */}
                <div>
                  <h3 className="mb-3 text-sm font-medium">Brands</h3>
                  <div className="flex flex-wrap gap-2">
                    {topBrands.map((brand) => (
                      <BadgeFilters
                        key={brand}
                        className="cursor-pointer transition-all hover:shadow-sm"
                        onClick={() => handleBrandToggle(brand)}
                        markCross={selectedBrands.includes(brand)}
                      >
                        {brand}
                      </BadgeFilters>
                    ))}
                    {brands.length > 12 && (
                      <Badge>+{brands.length - 12} more</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      <AnimatePresence>
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2"
          >
            {searchQuery && (
              <BadgeFilters onClick={() => handleSearchChange("")}>
                Search: &quot;{searchQuery}&quot;
              </BadgeFilters>
            )}
            {selectedCategories.map((category) => (
              <BadgeFilters
                key={category}
                onClick={() => handleCategoryToggle(category)}
              >
                Category: {category}
              </BadgeFilters>
            ))}
            {selectedBrands.map((brand) => (
              <BadgeFilters
                key={brand}
                onClick={() => handleBrandToggle(brand)}
              >
                Brand: {brand}
              </BadgeFilters>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BadgeFilters(props: BadgeFiltersProps) {
  const { children, markCross = true, ...z } = props;
  return (
    <Badge {...z} className="cursor-pointer transition-all hover:shadow-sm">
      {children}
      {markCross && <XIcon className="size-4" />}
    </Badge>
  );
}
