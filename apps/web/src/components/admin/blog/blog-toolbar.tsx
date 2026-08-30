"use client";

import {
  Button,
  Input,
  Label,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@neatly/ui";
import { motion } from "framer-motion";
import { type ReactElement, useId } from "react";
import { getMotionTransition } from "@/animations/config/motion";
import { useReducedMotion } from "@/animations/hooks/use-reduced-motion";
import { FilterIcon } from "@/components/admin/admin-icons";
import { BlogFilterChips } from "@/components/admin/blog/blog-filter-chips";
import { BlogQuickFilters } from "@/components/admin/blog/blog-filter-controls";
import { BlogFilterFields } from "@/components/admin/blog/blog-filter-fields";
import { adminBlogCopy } from "@/config/admin-blog";
import type { AdminBlogFilters } from "@/types/admin-blog";

interface BlogToolbarProps {
  filters: AdminBlogFilters;
  filtersOpen: boolean;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onFiltersChange: (filters: AdminBlogFilters) => void;
  onFiltersOpenChange: (open: boolean) => void;
}

export function BlogToolbar({
  filters,
  filtersOpen,
  hasActiveFilters,
  onClearFilters,
  onFiltersChange,
  onFiltersOpenChange,
}: BlogToolbarProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const searchId = useId();

  return (
    <motion.div
      className="flex flex-col gap-3"
      data-slot="blog-toolbar"
      variants={{
        hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 8 },
        visible: {
          opacity: 1,
          y: 0,
          transition: getMotionTransition(prefersReducedMotion),
        },
      }}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1">
          <Label className="sr-only" htmlFor={searchId}>
            {adminBlogCopy.searchLabel}
          </Label>
          <Input
            aria-label={adminBlogCopy.searchLabel}
            id={searchId}
            onChange={(event): void => {
              onFiltersChange({ ...filters, query: event.target.value });
            }}
            placeholder={adminBlogCopy.searchPlaceholder}
            type="search"
            value={filters.query}
          />
        </div>
        <BlogQuickFilters filters={filters} onFiltersChange={onFiltersChange} />
        <div className="flex items-center gap-2">
          <Sheet onOpenChange={onFiltersOpenChange} open={filtersOpen}>
            <Button
              aria-expanded={filtersOpen}
              onClick={(): void => onFiltersOpenChange(true)}
              type="button"
              variant="outline"
            >
              <FilterIcon />
              {adminBlogCopy.filtersLabel}
            </Button>
            <SheetContent
              closeLabel={adminBlogCopy.closeFiltersLabel}
              side="right"
            >
              <SheetHeader>
                <SheetTitle>{adminBlogCopy.filterSheetTitle}</SheetTitle>
                <SheetDescription>
                  {adminBlogCopy.filterSheetDescription}
                </SheetDescription>
              </SheetHeader>
              <BlogFilterFields
                filters={filters}
                onFiltersChange={onFiltersChange}
              />
            </SheetContent>
          </Sheet>
          <Button
            disabled
            title={adminBlogCopy.createUnavailable}
            type="button"
          >
            {adminBlogCopy.createAction}
          </Button>
        </div>
      </div>
      <BlogFilterChips
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        onFiltersChange={onFiltersChange}
      />
    </motion.div>
  );
}
