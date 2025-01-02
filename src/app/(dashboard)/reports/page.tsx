"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "@/app/api/config";

type AdminSettings = {
  monthsToLoan: number;
  gracePeriod: number;
  increaseRate: number;
};

type MemberInfo = {
  firstName: string;
  surname: string;
  email: string;
};

type MemberDetails = {
  amountPaid: number;
  img: string;
  telephone1: string;
  permanentHomeAddress: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
  bvn: string;
  residentialAddress: string;
};

type SavingsStats = {
  yearly: Record<string, number>;
  monthly: Record<string, number>;
  total: number;
};

type ReportData = {
  memberId: string;
  cooperativeId: string;
  adminSettings: AdminSettings;
  memberInfo?: MemberInfo | null; // Made optional to handle cooperative-admin
  memberDetails?: MemberDetails | null; // Made optional to handle cooperative-admin
  savingsStats: SavingsStats;
  loanStats: SavingsStats;
  assetStats: SavingsStats;
};

const ReportStats = () => {
  const [data, setData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("User not authenticated");
          return;
        }

        const token = await user.getIdToken();
        const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
        const response = await axios.get(`${serverURL}/reports/savings-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching report:", err);
        setError(err.response?.data?.error || "Failed to fetch report data");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <p className="text-center text-blue-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Savings Stats Report</h1>
      {data && (
        <div className="grid gap-4">
          {/* Member Info */}
          {data.memberInfo ? (
            <div>
              <h2 className="text-lg font-semibold">Member Information</h2>
              <p>
                Name: {data.memberInfo.firstName} {data.memberInfo.surname}
              </p>
              <p>Email: {data.memberInfo.email}</p>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold">Cooperative Summary</h2>
              <p>Viewing data for the entire cooperative.</p>
            </div>
          )}

          {/* Admin Settings */}
          <div>
            <h2 className="text-lg font-semibold">Admin Settings</h2>
            <p>Months to Loan: {data.adminSettings.monthsToLoan}</p>
            <p>Grace Period: {data.adminSettings.gracePeriod} days</p>
            <p>Increase Rate: {data.adminSettings.increaseRate}%</p>
          </div>

          {/* Savings Stats */}
          <div>
            <h2 className="text-lg font-semibold">Savings Statistics</h2>
            <table className="table-auto border-collapse border border-gray-300 w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Year</th>
                  <th className="border border-gray-300 px-4 py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.savingsStats.yearly).map(([year, amount]) => (
                  <tr key={year}>
                    <td className="border border-gray-300 px-4 py-2">{year}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      ${amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2">Total Savings: ${data.savingsStats.total.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportStats;
