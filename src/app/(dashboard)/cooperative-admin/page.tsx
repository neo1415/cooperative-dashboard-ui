"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Announcements from "@/components/Announcements";
import AssetChart from "@/components/AssetChart";
import CountChart from "@/components/CountChart";
import EventCalender from "@/components/EventCalender";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCards";
import { CooperativeData } from "../cooperative-profile/page";
import { useAuth } from "@/context/AuthCOntext";

const AdminPage = () => {
  const [cooperativeData, setCooperativeData] = useState<CooperativeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [processedStats, setProcessedStats] = useState<any>(null);
  const [timeFilter, setTimeFilter] = useState<"monthly" | "yearly" | "all">("yearly");

  const { role, cooperativeId, memberId, getCurrentUserToken } = useAuth();

  // Helper to preprocess stats
  const preprocessStats = (stats: any) => {
    const calculateTotals = (field: string) => {
      if (!stats[field]) return { monthly: {}, yearly: {}, all: { total: 0 } };

      const monthly = stats[field]?.monthly || {};
      const yearly = stats[field]?.yearly || {};

      const allTotal = Object.values(monthly).reduce((acc: number, item: any) => acc + (item.total || 0), 0);

      return {
        monthly,
        yearly,
        all: { total: allTotal },
      };
    };

    return {
      contributions: calculateTotals("contributions"),
      savings: calculateTotals("savings"),
      combined: calculateTotals("combined"),
      loansApproved: calculateTotals("loansApproved"),
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await getCurrentUserToken();
        if (!token) {
          setError("No authentication token found.");
          setLoading(false);
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const [savingsResponse, loanStatsResponse, cooperativeResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/total-savings`, { headers }),
          axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/loan-stats`, { headers }),
          axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/cooperative/profileSettings`, { headers }),
        ]);

        console.log("[DEBUG] Savings Response:", savingsResponse.data);
        console.log("[DEBUG] Loan Stats Response:", loanStatsResponse.data);
        console.log("[DEBUG] Cooperative Response:", cooperativeResponse.data);

        const processed = preprocessStats({
          ...savingsResponse.data,
          loansApproved: loanStatsResponse.data.stats || {},
        });

        setProcessedStats(processed);
        setCooperativeData(cooperativeResponse.data);
      } catch (err) {
        console.error("[ERROR] Failed to fetch data:", err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getCurrentUserToken, role, cooperativeId, memberId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Helper: Resolve data for the current time filter
  const resolveFilteredStats = (field: string) => {
    if (!processedStats || !processedStats[field]) return { total: 0 };

    const data = processedStats[field];
    if (timeFilter === "all") return data.all;

    // Dynamically resolve yearly or monthly totals
    if (timeFilter === "yearly") {
      const currentYear = new Date().getFullYear().toString(); // e.g., "2024"
      return data.yearly[currentYear] || { total: 0 };
    }

    if (timeFilter === "monthly") {
      const currentMonth = new Date().toISOString().slice(0, 7); // e.g., "2024-11"
      return data.monthly[currentMonth] || { total: 0 };
    }

    return { total: 0 };
  };

  const filteredStats = {
    contributions: resolveFilteredStats("contributions"),
    savings: resolveFilteredStats("savings"),
    combined: resolveFilteredStats("combined"),
    loansApproved: resolveFilteredStats("loansApproved"),
  };

  console.log("[DEBUG] Filtered Stats:", filteredStats);

  return (
    <div className="p-4 flex flex-col gap-4 lg:gap-8 md:flex-row">
      {/* LEFT SECTION */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        {/* Filter Buttons */}
        <div className="flex gap-4">
          {["monthly", "yearly", "all"].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded ${
                timeFilter === filter ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setTimeFilter(filter as "monthly" | "yearly" | "all")}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* USER CARDS */}
        <div className="flex flex-wrap gap-4 justify-between">
          <UserCard type="Total Contributions" value={filteredStats.contributions?.total || 0} />
          <UserCard type="Total Savings" value={filteredStats.savings?.total || 0} />
          <UserCard type="Combined Total" value={filteredStats.combined?.total || 0} />
          <UserCard type="Total Members" value={cooperativeData?.totals?.totalMembers || 0} />
          <UserCard type="Amount Granted" value={filteredStats.loansApproved?.total || 0} />
        </div>

        {/* MIDDLE CHARTS */}
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="w-full lg:w-1/3 h-[300px] md:h-[400px] xl:h-[450px]">
            <CountChart
              totalSavingsCount={filteredStats.savings?.total || 0}
              totalLoansApproved={filteredStats.loansApproved?.total || 0}
            />
          </div>
          <div className="w-full lg:w-2/3 h-[300px] md:h-[400px] xl:h-[450px]">
            <AssetChart
              totalSavingsCount={filteredStats.savings?.total || 0}
              totalLoansApproved={filteredStats.loansApproved?.total || 0}
            />
          </div>
        </div>

        {/* BOTTOM CHART */}
        <div className="w-full h-[350px] md:h-[400px] xl:h-[500px]">
          <FinanceChart />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <EventCalender />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
