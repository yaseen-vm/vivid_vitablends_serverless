import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/services/api/categoryApi";
import { Category } from "@/types/Category";
import { EXCLUDED_CATEGORY_NAMES } from "@/lib/constants";

export const useCategories = () => {
  const {
    data: categories = [],
    isLoading: loading,
    error,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: categoryApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const displayCategories = useMemo(
    () =>
      categories
        .filter(
          (cat) =>
            cat.showOnHome &&
            !EXCLUDED_CATEGORY_NAMES.includes(cat.name.toLowerCase())
        )
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [categories]
  );

  const getHomepageCategories = useMemo(
    () => displayCategories,
    [displayCategories]
  );

  return {
    categories,
    displayCategories,
    getHomepageCategories,
    loading,
    error: error as Error | null,
  };
};
