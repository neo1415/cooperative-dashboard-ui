import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthCOntext";

export interface PeriodStats {
  monthly: Record<string, number>;
  yearly: Record<string, number>;
  allTime: number;
  count: number;
}

export interface CooperativeStats {
  savings?: PeriodStats;
  loans?: {
    totalApprovedLoans: number;
    totalApprovedAmount: number;
  };
}

const useCooperativeStats = () => {
  const [stats, setStats] = useState<CooperativeStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getCurrentUserToken } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getCurrentUserToken();
        if (!token) throw new Error("No authentication token found.");

        const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

        // Fetch savings data
        const savingsPromise = axios.get(`${serverURL}/total-savings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch loan stats
        const loansPromise = axios.get(`${serverURL}/loan-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const [savingsResponse, loansResponse] = await Promise.all([savingsPromise, loansPromise]);

        setStats({
          savings: savingsResponse.data,
          loans: {
            totalApprovedLoans: loansResponse.data.totalGrantedAmount || 0,
            totalApprovedAmount: loansResponse.data.totalGrantedAmount || 0,
          },
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred.";
        setError(errorMessage);
        console.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [getCurrentUserToken]);

  return { stats, loading, error, setStats };
};

export default useCooperativeStats;
