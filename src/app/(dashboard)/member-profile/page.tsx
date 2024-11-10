"use client"

import Performance from "@/components/Performance";
import Image from "next/image";
import Link from "next/link";
import {  closePaymentModal, FlutterWaveButton } from 'flutterwave-react-v3';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, TextField, Typography } from '@mui/material';
import { auth } from "@/app/api/config";
import TransactionsTable from "../../../components/TransactionsTable";
import BigCalendar from "@/components/BigCalender";
import EventCalendar from "@/components/EventCalender";
import { FaCamera } from "react-icons/fa";

interface Member {
  id: string;
  surname: string;
  firstName: string;
  email: string;
  memberDetails?: MemberDetails; // Optional memberDetails array
  loansAppproved?:LoansApproved;
}

interface LoansApproved {
  id: string;
  amountRequired: number;
  purposeOfLoan: string;
  durationOfLoan: number;
  bvn: string;
  nameOfSurety1: string;
  surety1MembersNo: string;
  surety1telePhone: string;
  nameOfSurety2: string;
  surety2MembersNo: string;
  surety2telePhone: string;
  amountGranted?: number;
  loanInterest?: number;
  dateOfApplication: string;
  expectedReimbursementDate: string;
}
// MemberDetails interface
interface MemberDetails {
  middleName?: string;
  telephone1: string;
  telephone2?: string;
  sex: string;
  residentialAddress: string
  occupation: string;
  img:string
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


declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

const MemberProfilePage = () => {

  const [memberData, setMemberData] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(100); // Default deposit depositAmount
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [updatingImage, setUpdatingImage] = useState(false);

 // Handle Image Upload
 const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    setUpdatingImage(true);
    const user = auth.currentUser;
    if (!user) {
      setError("User not authenticated");
      return;
    }

    const token = await user.getIdToken();
    const formData = new FormData();
    formData.append("img", file);

    const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
    const response = await axios.put(`${serverURL}/member/update-profile-picture`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    // Re-fetch member data after updating
    setMemberData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        memberDetails: {
          ...prev.memberDetails,
          img: response.data.imageUrl, // Update the image URL
        },
      };
    });
  } catch (error) {
    console.error("Failed to update profile picture:", error);
    setError("Failed to update profile picture");
  } finally {
    setUpdatingImage(false);
  }
};


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
          const response = await axios.get<Member>(`${serverURL}/member/profileSettings`, {
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


  if (loading) return <CircularProgress />;
  if (error) return <p>{error}</p>;


  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
          <div className="w-1/3 relative">
            <Image
              src={memberData?.memberDetails?.img || "https://images.pexels.com/photos/5414817/pexels-photo-5414817.jpeg?auto=compress&cs=tinysrgb&w=1200"}
              alt="Profile Picture"
              width={144}
              height={144}
              className="w-36 h-36 rounded-full object-cover"
            />
            {/* Camera Icon for Upload */}
            {/* <label htmlFor="image-upload" className="absolute bottom-0 left-1/2 transform -translate-x-1/2 cursor-pointer">
              <FaCamera className="text-white bg-gray-800 rounded-full p-2 text-xl" />
            </label>
            <input
              type="file"
              id="image-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {updatingImage && <p className="text-sm text-gray-500">Updating...</p>} */}
          </div>
  
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold">{memberData?.surname} {memberData?.firstName}</h1>
              <p className="text-sm text-gray-500">
              {memberData?.memberDetails?.residentialAddress}

              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{memberData?.memberDetails?.occupation}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  {memberData?.loansAppproved?.purposeOfLoan}
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{memberData?.email}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{memberData?.memberDetails?.telephone1}</span>
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
                  ₦{transaction?.grandTotal?.toLocaleString('en-NG') || "0"}
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
                ₦{transaction?.savingsBalance?.toLocaleString('en-NG') || "0"}
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
                ₦{transaction?.totalWithdrawals?.toLocaleString('en-NG') || "0"}
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
                ₦{transaction?.savingsDeposits?.toLocaleString('en-NG') || "0"}
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
          <EventCalendar />
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

export default MemberProfilePage;