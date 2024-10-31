"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import InputField from "../InputField";
import { useRouter } from "next/navigation";
import axios from "axios";
import { auth } from "@/app/api/config";

// Define types for amount and duration ranges
interface Range {
  min: number;
  max: number;
  rate: number;
}

const schema = z.object({
  amountRequired: z.string().min(1, { message: "Amount Required is required!" }),
  purposeOfLoan: z.string().min(1, { message: "Purpose of Loan is required!" }),
  durationOfLoan: z.string().min(1, { message: "Duration of Loan is required!" }),
  bvn: z.string().length(11, { message: "BVN Number must be exactly 11 digits!" }),
  nameOfSurety1: z.string().min(1, { message: "Surety 1 Name is required!" }),
  surety1MembersNo: z.string().min(1, { message: "Surety 1 Members No is required!" }),
  surety1telePhone: z.string().min(10).max(15, { message: "Phone number must be 10-15 digits!" }),
  nameOfSurety2: z.string().min(1, { message: "Surety 2 Name is required!" }),
  surety2MembersNo: z.string().min(1, { message: "Surety 2 Members No is required!" }),
  surety2telePhone: z.string().min(10).max(15, { message: "Phone number must be 10-15 digits!" }),
});

export type Inputs = z.infer<typeof schema>;

const LoanForm = () => {
  const [loanInterest, setLoanInterest] = useState(10); // Default interest rate
  const [amountRanges, setAmountRanges] = useState<Range[]>([]);
  const [durationRanges, setDurationRanges] = useState<Range[]>([]);
  const [amountGranted, setAmountGranted] = useState(0);
  const [expectedReimbursementDate, setExpectedReimbursementDate] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const amountRequired = watch("amountRequired");
  const durationOfLoan = watch("durationOfLoan");

  const fetchInterestSettings = async () => {
    try {
      const token = localStorage.getItem('firebaseToken');
      console.log("Token retrieved for interest settings:", token);
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/fetch-loan-interest-settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { data } = response;
  
      console.log("Interest settings fetched:", data);
      setAmountRanges(data.amountRanges);
      setDurationRanges(data.durationRanges);
    } catch (error) {
      console.error("Failed to fetch loan interest settings:", error);
    }
  };
  

  useEffect(() => {
    if (amountRequired && durationOfLoan && amountRanges.length && durationRanges.length) {
      const amount = parseFloat(amountRequired);
      const duration = parseInt(durationOfLoan);

      const selectedAmountRange = amountRanges.find((range) =>
        amount >= range.min && amount <= range.max
      );

      const selectedDurationRange = durationRanges.find((range) =>
        duration >= range.min && duration <= range.max
      );

      const calculatedInterest = selectedAmountRange?.rate ?? loanInterest;

      const principal = amount;
      const interest = principal * Math.pow((1 + calculatedInterest / 100), duration / 12) - principal;
      setAmountGranted(principal + interest);

      const now = new Date();
      const reimbursementDate = new Date(now.setMonth(now.getMonth() + duration));
      setExpectedReimbursementDate(reimbursementDate.toISOString().split("T")[0]);
    }
  }, [amountRequired, durationOfLoan, amountRanges, durationRanges]);

  const onSubmit = handleSubmit(async (data) => {
    const memberId = localStorage.getItem('userId');
    const cooperativeId = localStorage.getItem('cooperativeId');
    
    if (!cooperativeId || !memberId) {
      setSubmitError('Error: Cooperative or Member ID not found. Please log in again.');
      return;
    }
  
    const payload = {
      memberId,
      cooperativeId,
      ...data,
      amountGranted,
      expectedReimbursementDate,
      loanInterest,
    };
  
    const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
  
    try {
      const token = localStorage.getItem("firebaseToken");
      const response = await axios.post(`${serverURL}/loan-request`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        router.push('/success');
      } else {
        setSubmitError(response.data.error || 'Failed to submit loan request');
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setSubmitError(error.response?.data?.error || error.message || 'Error connecting to the server.');
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      {/* Form content here */}
    </form>
  );
};

export default LoanForm;
