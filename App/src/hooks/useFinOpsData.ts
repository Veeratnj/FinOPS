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
        setLoading(true);
        const token = localStorage.getItem("access_token");
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        // Call the dynamic metrics API endpoint backed 100% by PostgreSQL
        let endpoint = `${API_BASE_URL}/api/metrics/all`;
        let res = await fetch(endpoint, { headers });

        if (!res.ok) {
          endpoint = `${API_BASE_URL}/metrics/all`;
          res = await fetch(endpoint, { headers });
        }

        if (!res.ok) {
          throw new Error(`Failed to fetch FinOps metrics from PostgreSQL database: ${res.status}`);
        }

        const json: FinOpsData = await res.json();
        setData(json);
        setError(null);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error while querying PostgreSQL API";
        setError(msg);
        console.error("FinOps API error:", msg);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
}
