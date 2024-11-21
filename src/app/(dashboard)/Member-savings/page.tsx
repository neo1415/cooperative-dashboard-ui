"use client"

import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalender";
import Performance from "@/components/Performance";
import Image from "next/image";
import Link from "next/link";
import {  closePaymentModal, FlutterWaveButton } from 'flutterwave-react-v3';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, TextField, Typography } from '@mui/material';
import { auth } from "@/app/api/config";
import TransactionsTable from "../../../components/TransactionsTable";
import LoanFormModal from "@/components/forms/LoanForm";
import useFetchAdminSettings from "@/hooks/useAdminSettings";
import { useAuth } from "@/context/AuthCOntext";

interface Member {
  id: string;
  surname: string;
  firstName: string;
  email: string;
  memberDetails?: MemberDetails; // Optional memberDetails array
}

// MemberDetails interface
interface MemberDetails {
  middleName?: string;
  telephone1: string;
  telephone2?: string;
  sex: string;
  residentialAddress: string;
  occupation: string;
  registrationNumber: string;
  dateOfBirth:string;
  img: string;
}

export interface Transaction {
  id: string;
  firstName?: string;
  surname?: string;
  email?: string;
  dateOfEntry: string;
  telephone?: string;
  savingsDeposits: number;
  withdrawals: number;
  savingsBalance: number;
  totalWithdrawals: number;
  grandTotal: number;
}

interface Stats {
  totalContributions: number;
  totalSavings: number;
  totalLoans: number;
  latestTransaction: {
    type: string;
    amount: number;
    date: string;
  } | null;
  savingsBalance: number;
}

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

const MemberSavingsPage = () => {

  const [memberData, setMemberData] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(100); // Default deposit depositAmount
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [isEligible, setIsEligible] = useState(false);// 
  const [stats, setStats] = useState<Stats | null>(null);
  // Fetch the admin settings
  const { role } = useAuth(); // Retrieve role from AuthContext
  const { adminSettings} = useFetchAdminSettings(role); // Pass role to the hook

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          setError("User not authenticated");
          return;
        }

        const token = await user.getIdToken();
        const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
        const response = await axios.get(`${serverURL}/member/savings/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data.stats;
        const latestRecord = data[data.length - 1];

        // Calculate totals
        const totalContributions = data.reduce((sum, record) => sum + (record.contributions || 0), 0);
        const totalSavings = data.reduce((sum, record) => sum + (record.savings || 0), 0);
        const totalLoans = data.reduce((sum, record) => sum + (record.loans || 0), 0);

        // Get the latest transaction
        const latestTransaction = latestRecord
          ? {
              type: latestRecord.contributions > 0
                ? "Contribution"
                : latestRecord.savings > 0
                ? "Savings"
                : latestRecord.loans > 0
                ? "Loan"
                : "None",
              amount:
                latestRecord.contributions ||
                latestRecord.savings ||
                latestRecord.loans ||
                0,
              date: latestRecord.date,
            }
          : null;

        // Update state
        setStats({
          totalContributions,
          totalSavings,
          totalLoans,
          latestTransaction,
          savingsBalance: latestRecord?.grandTotal || 0,
        });

        // Check eligibility
        setIsEligible(response.data.eligibility === "Eligible for Loan");
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError("Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  
    const handleOpenLoanForm = () => {
      if (!isEligible) {
        alert('You are not eligible for a loan. Please check your contribution history.');
        return;
      }
  
      // Show the LoanFormModal if eligible
      setIsModalOpen(true);
    };
  
    const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
          const response = await axios.get<Transaction>(`${serverURL}/single-transaction`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setTransaction(response.data);
        } else {
          setError('User not authenticated');
        }
      } catch (error) {
        setError('Failed to fetch transaction');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, []);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
          const response = await axios.get<Member>(`${serverURL}/member/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMemberData(response.data);
        } else {
          setError('User not authenticated');
        }
      } catch (error) {
        setError('Failed to fetch member data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMemberData();
  }, []);

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
    tx_ref: Date.now().toString(),
    amount: depositAmount,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: memberData?.email || "default-email@example.com",
      phone_number: memberData?.memberDetails?.telephone1 || "0000000000",
      name: `${memberData?.firstName || ""} ${memberData?.surname || ""}`,
    },
    customizations: {
      title: "Savings Payment",
      description: "Deposit for cooperative Savings",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };

  // Flutterwave configuration for "savings" deposit
  const savingsConfig = {
    ...config,
    callback: async (response: any) => {
      if (response.status === "successful") {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/member/savings`,
          { amount: depositAmount, type: "savings", transactionId: response.transaction_id },
          { headers: { Authorization: `Bearer ${await auth.currentUser?.getIdToken()}` } }
        );
      }
      closePaymentModal();
    },
    onClose: () => {},
  };

  // Flutterwave configuration for "contribution" deposit
  const contributionConfig = {
    ...config,
    callback: async (response: any) => {
      if (response.status === "successful") {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/member/savings`,
          { amount: depositAmount, type: "contribution", transactionId: response.transaction_id },
          { headers: { Authorization: `Bearer ${await auth.currentUser?.getIdToken()}` } }
        );
      }
      closePaymentModal();
    },
    onClose: () => {},
  };


  if (loading) return <CircularProgress />;
  if (error) return <p>{error}</p>;


  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT SIDE */}
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        
        {/* TOP SECTION */}
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* USER INFO CARD */}
          <div className="bg-lamaSky p-6 rounded-md flex-1 flex flex-col sm:flex-row gap-4">
            <div className="sm:w-1/3 flex justify-center">
              <Image
                src={memberData?.memberDetails?.img || "https://images.pexels.com/photos/5414817/pexels-photo-5414817.jpeg?auto=compress&cs=tinysrgb&w=1200"}
                alt="member-profile-picture"
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="sm:w-2/3 flex flex-col justify-between gap-4 text-center sm:text-left">
              <h1 className="text-xl font-semibold">{`${memberData?.surname} ${memberData?.firstName}`}</h1>
              <p className="text-sm text-gray-500">
                {memberData?.memberDetails?.residentialAddress || "No Address Available"}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 text-xs font-medium">
                {[
                  { icon: "/blood.png", text: memberData?.memberDetails?.registrationNumber || "Unknown" },
                  { icon: "/date.png", text: memberData?.memberDetails?.dateOfBirth },
                  { icon: "/mail.png", text: memberData?.email || "No Email" },
                  { icon: "/phone.png", text: memberData?.memberDetails?.telephone1 || "No Phone" }
                ].map((item, index) => (
                  <div key={index} className="w-full md:w-1/2 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                    <Image src={item.icon} alt="" width={14} height={14} />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          {/* SMALL CARDS */}
          <div className="flex-1 flex flex-wrap gap-4">
          {stats
    ? [
        {
          icon: "/singleAttendance.png",
          label: "Balance",
          value: stats.savingsBalance,
        },
        {
          icon: "/singleBranch.png",
          label: "Total Saved",
          value: stats.totalSavings,
        },
        {
          icon: "/singleLesson.png",
          label: "Total Loans",
          value: stats.totalLoans,
        },
        {
          icon: "/singleClass.png",
          label: "Latest Transaction",
          value: stats.latestTransaction
            ? `${stats.latestTransaction.type}: ₦${stats.latestTransaction.amount.toLocaleString(
                "en-NG"
              )} `
            : "No Transactions",
        },
      ].map((card, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-md flex gap-4 w-full sm:w-[48%] xl:w-[45%] 2xl:w-[48%]"
        >
          <Image
            src={card.icon}
            alt=""
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <div>
            <h1 className="text-xl font-semibold">
              {typeof card.value === "number"
                ? `₦${card.value.toLocaleString("en-NG")}`
                : card.value}
            </h1>
            <span className="text-sm text-gray-400">{card.label}</span>
          </div>
        </div>
      ))
    : loading
    ? <p>Loading...</p>
    : <p className="text-red-500">{error}</p>}
</div>
        </div>
  
        {/* BOTTOM SECTION */}
        <div className="mt-4 bg-white rounded-md p-4">
          <h1 className="text-lg font-semibold">Savings & Loans</h1>
          <div className="h-[600px] xl:h-[800px] overflow-y-auto">
            <TransactionsTable />
          </div>
        </div>
      </div>
  
      {/* RIGHT SIDE */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        
        {/* SAVINGS CARD */}
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Savings</h1>
          <div className="mt-4 flex flex-col gap-4 bg-white p-6 rounded-lg">
            <Typography variant="h6" className="font-semibold">
              Enter Amount to Deposit
            </Typography>
            <TextField
              label="Deposit Amount (NGN)"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              type="number"
              fullWidth
              variant="outlined"
            />
            <div>
            <FlutterWaveButton {...savingsConfig} text="Deposit for Savings" />
            </div>
           
            <div>
            <FlutterWaveButton {...contributionConfig} text="Deposit for Contribution" />
            </div>
          
          </div>
        </div>
  
        {/* LOANS CARD */}
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Loans</h1>
          <div className="mt-4 flex flex-col gap-4 p-3 rounded-md bg-lamaYellowLight">
        {loading || checkingEligibility ? (
          <p>Loading eligibility...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <button
            className={`px-4 py-2 rounded ${isEligible ? 'bg-green-500' : 'bg-red-500'} text-white`}
            onClick={handleOpenLoanForm}
          >
            {isEligible ? 'Apply for a Loan' : 'Ineligible for Loan'}
          </button>
        )}
        {isModalOpen && <LoanFormModal />}
      </div>
        </div>
  
        {/* PERFORMANCE CARD */}
        <Performance />
      </div>
    </div>
  );
  
  
};

export default MemberSavingsPage;