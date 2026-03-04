import { API_BASE_URL } from "@/lib/config";
import { apiClient } from "@/lib/apiClient";
import { Review } from "@/types/Review";

export const reviewApi = {
  getAll: async (): Promise<Review[]> => {
    const res = await fetch(`${API_BASE_URL}/api/reviews`);
    if (!res.ok) throw new Error("Failed to fetch reviews");
    const json = await res.json();
    return json.data || json;
  },
  getHeroReviews: async (): Promise<Review[]> => {
    const res = await fetch(`${API_BASE_URL}/api/reviews/hero`);
    if (!res.ok) throw new Error("Failed to fetch hero reviews");
    const json = await res.json();
    return json.data || json;
  },
  create: async (data: {
    name: string;
    rating: number;
    comment: string;
  }): Promise<Review> => {
    const res = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create review");
    const json = await res.json();
    return json.data || json;
  },
  updateShowInHero: async (
    id: string,
    showInHero: boolean
  ): Promise<Review> => {
    const res = await apiClient(
      `${API_BASE_URL}/api/reviews/${id}/show-in-hero`,
      {
        method: "PATCH",
        body: JSON.stringify({ showInHero }),
      }
    );
    if (!res.ok) throw new Error("Failed to update review");
    const json = await res.json();
    return json.data || json;
  },
};
