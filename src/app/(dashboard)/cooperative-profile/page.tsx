"use client"

import Announcements from "@/components/Announcements";
import Performance from "@/components/Performance";
import Image from "next/image";
import Link from "next/link";
import {  closePaymentModal, FlutterWaveButton } from 'flutterwave-react-v3';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, TextField, Typography } from '@mui/material';
import { auth } from "@/app/api/config";
import TransactionsTable from "../../../components/TransactionsTable";

// interface CooperativeDetails {
//   registrationNumber: string;
//   dateOfIncorporation: string;
//   address: string;
//   email: string;
//   phoneNumber: string;
//   totalSavings: number;
//   totalDebt: number;
//   totalLoansRequested: number;
//   totalLoansApproved: number;
//   totalProfit: number;
//   directorName: string;
//   directorPosition: string;
//   directorEmail: string;
//   directorPhoneNumber: string;
//   directorDateOfBirth: string;
//   directorPlaceOfBirth: string;
//   directorNationality: string;
//   directorOccupation: string;
//   directorBVNNumber: string;
//   directorIDType: string;
//   directorIDNumber: string;
//   directorIssuedDate: string;
//   directorExpiryDate: string;
//   directorSourceOfIncome: string;
// }

// interface CooperativeTotals {
//   totalSavings: number;
//   totalLoansRequested: number;
//   totalLoansApproved: number;
//   totalSavingsCount: number;
//   totalLoansRequestedCount: number;
//   totalLoansApprovedCount: number;
// }

// interface Cooperative {
//   id: string;
//   email: string;
//   cooperativeName: string;
//   createdAt: string;
//   cooperativeDetails?: CooperativeDetails;
//   members?: any[];
//   totals: CooperativeTotals;
// }


interface Member {
  id: string;
  firstName: string;
  surname: string;
  email: string;
  memberSavings?: { amount: number }[];
  loansRequested?: { amount: number }[];
  loansApproved?: { amount: number }[];
}

interface CooperativeDetails {
  address: string;
  directorName: string;
  directorPhoneNumber: string;
  directorEmail: string;
  directorPosition: string;
  registrationNumber: string;
  img: string
}

export interface CooperativeData {
  id: string;
  cooperativeName: string;
  email: string;
  createdAt: string;
  cooperativeDetails: CooperativeDetails[];
  members: Member[];
  totals: {
    totalSavings: number;
    totalLoansRequested: number;
    totalLoansApproved: number;
    totalSavingsCount: number;
    totalLoansRequestedCount: number;
    totalLoansApprovedCount: number;
    totalMembers: number;
  };
}

const CooperativeProfilePage = () => {
  const [cooperativeData, setCooperativeData] = useState<CooperativeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCooperativeData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (user){
          const token = await user.getIdToken();
          const response = await axios.get<CooperativeData>(`${process.env.NEXT_PUBLIC_SERVER_URL}/cooperative/profileSettings`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCooperativeData(response.data);
        } else {
          setError("User not Authenticated")
        }
      } catch (err) {
        setError("Failed to fetch cooperative data");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCooperativeData();
  }, []);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!cooperativeData) return null;

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
            <Image
  src={
    cooperativeData?.cooperativeDetails?.[0]?.img ||
    "https://images.pexels.com/photos/5414817/pexels-photo-5414817.jpeg?auto=compress&cs=tinysrgb&w=1200"
  }
  alt="Cooperative Image"
  width={144}
  height={144}
  className="w-36 h-36 rounded-full object-cover"
/>
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              {/* <h1 className="text-xl font-semibold">{cooperativeData?.surname} {cooperativeData?.firstName}</h1> */}
              <p className="text-sm text-gray-500">
              {/* {cooperativeData?.cooperativeDetails?.residentialAddress} */}

              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  {/* <span>{cooperativeData?.cooperativeDetails?.occupation}</span> */}
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  {cooperativeData.cooperativeDetails?.[0]?.registrationNumber || 'N/A'}
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{cooperativeData?.email}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  {/* <span>{cooperativeData?.cooperativeDetails?.}</span> */}
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
              <h1 className="text-xl font-semibold">
                  {/* ₦{transaction?.grandTotal?.toLocaleString('en-NG') || "0"} */}
                  </h1>
              <span className="text-sm text-gray-400">Balance</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                {/* ₦{transaction?.savingsBalance?.toLocaleString('en-NG') || "0"} */}
                  </h1>
                <span className="text-sm text-gray-400">Total Saved</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                {/* ₦{transaction?.totalWithdrawals?.toLocaleString('en-NG') || "0"} */}
                  </h1>
                <span className="text-sm text-gray-400">Total Withdrawals</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                {/* ₦{transaction?.savingsDeposits?.toLocaleString('en-NG') || "0"} */}
                  </h1>
                <span className="text-sm text-gray-400">Latest Deposit</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Savings & WIthdrawals</h1>
          <TransactionsTable />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Savings</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
           
          <div className="flex flex-col gap-4 bg-white p-8 rounded-lg max-w-md mx-auto mt-4">
          <Typography variant="h6" className="font-semibold">
            Calendar Reminder
          </Typography>
          {/* <EventCalendar /> */}
        </div>
          </div>
        </div>
      
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">WIthdrawals</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            
            <div className="p-3 rounded-md bg-lamaYellowLight" >
             Withdrawal
                    {/* <FlutterWaveButton {...fwConfig} /> */}
                    Coming Soon
            </div>
       
          </div>
        </div>
        <Performance />
        {/* <Announcements /> */}
      </div>

    </div>
  );
};

export default CooperativeProfilePage;