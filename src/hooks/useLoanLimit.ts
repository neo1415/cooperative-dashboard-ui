import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthCOntext';
import { auth } from '@/app/api/config';
import useFetchAdminSettings from './useAdminSettings';

interface LoanLimitData {
  loanLimit: number | null;
  loading: boolean;
  error: string | null;
}

const useLoanLimit = (): LoanLimitData => {
  const [loanLimit, setLoanLimit] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { role } = useAuth();
  const { getSettingValue, loading: adminLoading, error: adminError } = useFetchAdminSettings(role);

  useEffect(() => {
    const fetchLoanLimit = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("User not authenticated");
          return;
        }

        const token = await user.getIdToken();
        const loanUpperLimit = getSettingValue("loanUpperLimit") || 0; // Fetch from adminSettings
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/single-transaction`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const totalSavings = response.data.savingsBalance || 0; // Assume 0 if undefined
        setLoanLimit(totalSavings * Number(loanUpperLimit));
      } catch (err) {
        console.error("Error fetching loan limit:", err);
        setError("Failed to calculate loan limit");
      } finally {
        setLoading(false);
      }
    };

    if (!adminLoading) fetchLoanLimit();
  }, [getSettingValue, role, adminLoading]);

  return { loanLimit, loading: loading || adminLoading, error: error || adminError };
};

export default useLoanLimit;
