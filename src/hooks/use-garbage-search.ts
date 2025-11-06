import { useEffect, useState, useMemo } from "react";
import Fuse from "fuse.js";
import type { GarbageItemWithCategory } from "@/types/garbage";

export function useGarbageSearch(query: string) {
  const [items, setItems] = useState<GarbageItemWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch("/api/garbage-items")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch garbage items");
        }
        return res.json();
      })
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const fuse = useMemo(() => {
    if (items.length === 0) return null;
    return new Fuse(items, {
      keys: ["name", "note"],
      threshold: 0.3,
      distance: 100,
      minMatchCharLength: 1,
      includeScore: true,
    });
  }, [items]);

  const results = useMemo(() => {
    if (!query || query.trim() === "") return items;
    if (!fuse) return [];
    return fuse.search(query).map((result) => result.item);
  }, [fuse, query, items]);

  return { results, loading, error };
}
