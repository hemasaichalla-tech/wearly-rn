import { useState, useCallback } from "react";
import {
  getUserOutfits,
  searchOutfits,
  toggleFavorite,
  getUserFavorites,
  isFavorited,
  Outfit,
} from "../services/outfitService";

export function useOutfits(userId: string | undefined) {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOutfits = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getUserOutfits(userId);
      setOutfits(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const search = useCallback(
    async (query: string, filters: { type?: string; color?: string; style?: string } = {}) => {
      if (!userId) return [];
      setLoading(true);
      try {
        const results = await searchOutfits(userId, query, filters);
        setOutfits(results);
        return results;
      } catch (e: any) {
        setError(e.message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return { outfits, loading, error, fetchOutfits, search, setOutfits };
}

export function useFavorites(userId: string | undefined) {
  const [favorites, setFavorites] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getUserFavorites(userId);
      setFavorites(data);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const toggle = useCallback(
    async (outfitId: string) => {
      if (!userId) return false;
      const isNowFav = await toggleFavorite(userId, outfitId);
      await fetchFavorites();
      return isNowFav;
    },
    [userId, fetchFavorites]
  );

  return { favorites, loading, fetchFavorites, toggle };
}
