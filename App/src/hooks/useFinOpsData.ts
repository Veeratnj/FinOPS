import { useState, useEffect } from "react";
import type { FinOpsData } from "@/types/finops.types";

interface UseFinOpsDataReturn {
  data: FinOpsData | null;
  loading: boolean;
  error: string | null;
}

// API base URL - configured via environment variable, or empty in production (proxied by Nginx), or localhost in dev
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "http://localhost:8000" : "");

export function useFinOpsData(): UseFinOpsDataReturn {
  const [data, setData] = useState<FinOpsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Call the metrics API endpoint instead of static file
        const endpoint = `${API_BASE_URL}/metrics/all`;
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);
        const json: FinOpsData = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        // Fallback to static file if API is not available (for development)
        console.warn("API unavailable, attempting fallback...");
        try {
          const fallbackRes = await fetch("/fakedata.json");
          if (fallbackRes.ok) {
            const json: FinOpsData = await fallbackRes.json();
            setData(json);
            setError(null);
          }
        } catch (fallbackErr) {
          console.error("Fallback also failed:", fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
}
