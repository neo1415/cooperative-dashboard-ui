"use client";

import Announcements from '@/components/Announcements';
import AssetChart from '@/components/AssetChart';
import CountChart from '@/components/CountChart';
import EventCalender from '@/components/EventCalender';
import FinanceChart from '@/components/FinanceChart';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CooperativeData } from '../cooperative-profile/page';
import UserCard from '@/components/UserCards';
import { useAuth } from '@/context/AuthCOntext';

const AdminPage = () => {
  const [cooperativeData, setCooperativeData] = useState<CooperativeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalSavings, setTotalSavings] = useState(0);
  const [totalLoansApproved, setTotalLoansApproved] = useState(0);
  const { getCurrentUserToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await getCurrentUserToken();
        if (!token) {
          setError("No authentication token found.");
          return;
        }

        // Fetch data from /single-transaction
        const transactionResponse = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/single-transaction`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalSavings(transactionResponse.data.savingsBalance);

        // Fetch data from /loan-stats
        const loanStatsResponse = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/loan-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalLoansApproved(loanStatsResponse.data.totalGrantedAmount || 0);
      } catch (err) {
        setError("Failed to fetch data");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getCurrentUserToken]);

  useEffect(() => {
    const fetchCooperativeData = async () => {
      try {
        setLoading(true);
        const token = await getCurrentUserToken();
        if (!token) {
          setError("No authentication token found.");
          return;
        }

        const response = await axios.get<CooperativeData>(`${process.env.NEXT_PUBLIC_SERVER_URL}/cooperative/profileSettings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCooperativeData(response.data);
      } catch (err) {
        setError("Failed to fetch cooperative data");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCooperativeData();
  }, [getCurrentUserToken]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!cooperativeData) return null;

  const { totals } = cooperativeData;

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USERCARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
        <UserCard type="Total Savings" value={totalSavings} />
        <UserCard type="Loans Approved" value={totalLoansApproved} />
          <UserCard type="Approved Loans Count" value={totals.totalLoansApprovedCount} />
          <UserCard type="Total Members" value={totals.totalMembers} />
        </div>
        
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart totalSavingsCount={totals.totalSavingsCount} totalLoansApproved={totals.totalLoansApprovedCount} />
          </div>
          <div className="w-full lg:w-2/3 h-[450px]">
            <AssetChart totalSavingsCount={totals.totalSavingsCount} totalLoansApproved={totals.totalLoansApprovedCount} />
          </div>
        </div>
        
        {/* BOTTOM CHARTS */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalender />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
