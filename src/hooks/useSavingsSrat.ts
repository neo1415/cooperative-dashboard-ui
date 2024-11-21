// File: /client/hooks/useSavingsStats.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthCOntext';


// Define the shape of the expected response
interface LoanStats {
  totalLoans: number;
  approvedLoans: number;
  totalRequestedAmount: number;
  totalGrantedAmount: number;
}

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
  const [loanStats, setLoanStats] = useState<LoanStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSavingsStats = async () => {
      console.log('Starting fetchSavingsStats...');
      try {
        setLoading(true);

        const token = await getCurrentUserToken();
        if (!token) {
          console.error('Authentication token not found');
          throw new Error('Authentication token not found');
        }

        const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

        // Determine the API endpoint and params based on user role
        const endpoint =
          role === 'Cooperative Admin'
            ? `${serverURL}/cooperative/savings/stats?cooperativeId=${cooperativeId}`
            : `${serverURL}/member/savings/stats?memberId=${memberId}`;

        console.log(`Sending API request to ${endpoint} as ${role}...`);
        const response = await axios.get<SavingsStats>(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('API response received:', response.data);

        const { stats } = response.data;

        // Aggregate loan statistics
        const totalLoans = stats.reduce(
          (count, record) => count + (record.loans > 0 ? 1 : 0),
          0
        );
        const approvedLoans = stats.reduce(
          (count, record) =>
            count +
            (record.loans > 0 && record.grandTotal >= 0 ? 1 : 0),
          0
        );
        const totalRequestedAmount = stats.reduce(
          (sum, record) => sum + record.loans,
          0
        );
        const totalGrantedAmount = stats.reduce(
          (sum, record) =>
            sum + (record.grandTotal >= 0 ? record.loans : 0),
          0
        );

        console.log('Calculated totals:', {
          totalLoans,
          approvedLoans,
          totalRequestedAmount,
          totalGrantedAmount,
        });

        setLoanStats({
          totalLoans,
          approvedLoans,
          totalRequestedAmount,
          totalGrantedAmount,
        });

        console.log('Updated loanStats state:', {
          totalLoans,
          approvedLoans,
          totalRequestedAmount,
          totalGrantedAmount,
        });
      } catch (err: any) {
        console.error('Error fetching stats:', err.message || err);
        setError(err.message || 'Failed to fetch stats');
      } finally {
        setLoading(false);
        console.log('Finished fetching stats');
      }
    };

    fetchSavingsStats();
  }, [role, cooperativeId, memberId, getCurrentUserToken]);

  return { loanStats, loading, error };
};
