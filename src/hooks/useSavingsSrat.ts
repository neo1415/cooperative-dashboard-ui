import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthCOntext';

// Define the shape of the loan statistics
interface LoanStats {
  totalLoans: number;
  approvedLoans: number;
  totalRequestedAmount: number;
  totalGrantedAmount: number;
}

// Define the shape of the savings statistics API response
interface SavingsStats {
  stats: Array<{
    date: string;
    savings: number;
    contributions: number;
    loans: number;
    grandTotal: number;
  }>;
  requesterType: 'Cooperative Admin' | 'Member';
}

export const useSavingsStats = () => {
  const { role, cooperativeId, memberId, getCurrentUserToken } = useAuth();

  // State for loan stats
  const [loanStats, setLoanStats] = useState<LoanStats | null>(null);

  // State for error messages
  const [error, setError] = useState<string | null>(null);

  // State for loading indicator
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSavingsStats = async () => {
      try {
        setLoading(true);

        // Get the authentication token
        const token = await getCurrentUserToken();
        if (!token) throw new Error('Authentication token not found');

        const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

        if (!cooperativeId && !memberId) throw new Error('User ID not found');

        // Determine the endpoint based on the user's role
        const endpoint =
          role === 'Cooperative Admin'
            ? `${serverURL}/cooperative/savings/stats?cooperativeId=${cooperativeId}`
            : `${serverURL}/member/savings/stats?memberId=${memberId}`;

        // Make the API call
        const response = await axios.get<SavingsStats>(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { stats } = response.data;

        // Aggregate loan statistics
        const totalLoans = stats.filter((record) => record.loans > 0).length;
        const approvedLoans = stats.filter(
          (record) => record.loans > 0 && record.grandTotal >= 0
        ).length;
        const totalRequestedAmount = stats.reduce((sum, record) => sum + record.loans, 0);
        const totalGrantedAmount = stats.reduce(
          (sum, record) => sum + (record.grandTotal >= 0 ? record.loans : 0),
          0
        );

        // Update the loan stats state
        setLoanStats({ totalLoans, approvedLoans, totalRequestedAmount, totalGrantedAmount });
      } catch (err: any) {
        // Handle errors
        setError(err.message || 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchSavingsStats();
  }, [role, cooperativeId, memberId, getCurrentUserToken]);

  return { loanStats, loading, error };
};
