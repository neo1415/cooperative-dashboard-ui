"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import InputField from "../InputField";
import { useRouter } from "next/navigation";
import axios from "axios";
import { auth } from "@/app/api/config";
import { useAuth } from '@/context/AuthCOntext';
import { browserSessionPersistence, setPersistence } from 'firebase/auth';

// Define types for amount and duration ranges
interface Range {
  min: number;
  max: number;
  rate: number;
}
interface Setting {
  id: string; // Allow `id` to be a string for temporary entries
  minDurationMonths: number | null;
  maxDurationMonths: number | null;
  durationInterestRate: number | null;
  minAmount: number | null;
  maxAmount: number | null;
  amountInterestRate: number | null;
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
  const [amountInterestRate, setAmountInterestRate] = useState(0);
  const [durationInterestRate, setDurationInterestRate] = useState(0);
  const [settings, setSettings] = useState<Setting[]>([]);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const amountRequired = watch("amountRequired");
  const durationOfLoan = watch("durationOfLoan");


  
  const { role } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      if (role === 'member') {
        setPersistence(auth, browserSessionPersistence).catch((error) => {
          console.error("Persistence error: ", error);
        });

        auth.onAuthStateChanged(async (user) => {
          if (user) {
            try {
              const token = await user.getIdToken();
              const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/fetch-loan-interest-settings`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });

              if (response.status === 200) {
                // Convert IDs to strings if not already
                const fetchedSettings: Setting[] = response.data.map((setting: any) => ({
                  ...setting,
                  id: String(setting.id), // Ensure ID is a string
                }));
                setSettings(fetchedSettings);
                console.log(fetchedSettings);
              } else {
                throw new Error('Failed to fetch settings');
              }
            } catch (error) {
              console.error("Error fetching settings:", error);
            }
          }
        });
      }
    };

    fetchSettings();
  }, [role]);

  useEffect(() => {
    if (settings.length > 0) {
      const amountRangeData = settings.map((setting) => ({
        min: setting.minAmount!,
        max: setting.maxAmount!,
        rate: setting.amountInterestRate!,
      }));
      const durationRangeData = settings.map((setting) => ({
        min: setting.minDurationMonths!,
        max: setting.maxDurationMonths!,
        rate: setting.durationInterestRate!,
      }));
  
      setAmountRanges(amountRangeData);
      setDurationRanges(durationRangeData);
    }
  }, [settings]);

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

    setAmountInterestRate(selectedAmountRange?.rate ?? loanInterest);
    setDurationInterestRate(selectedDurationRange?.rate ?? loanInterest);

    const principal = amount;
    const totalInterestRate = (amountInterestRate + durationInterestRate) / 2;
    const interest = principal * Math.pow((1 + totalInterestRate / 100), duration / 12) - principal;
    setAmountGranted(principal + interest);

    const now = new Date();
    const reimbursementDate = new Date(now.setMonth(now.getMonth() + duration));
    setExpectedReimbursementDate(reimbursementDate.toISOString().split("T")[0]);
  }
}, [amountRequired, durationOfLoan, amountRanges, durationRanges, amountInterestRate, durationInterestRate]);

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
      loanInterest: amountInterestRate, // Include one of the interest rates as loanInterest
      additionalInterestRate: durationInterestRate, // Add a new key for the second interest rate
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
    <InputField label="Amount Required" type="number" {...register("amountRequired")} error={errors.amountRequired?.message} />
    <div>Amount Interest Rate: {loanInterest}%</div>
    <InputField label="Duration of Loan (in months)" type="number" {...register("durationOfLoan")} error={errors.durationOfLoan?.message} />
    <div>Duration Interest Rate: {loanInterest}%</div>
    <div>Repayment Amount: ${amountGranted.toFixed(2)}</div>
    <InputField label="Purpose of Loan" {...register("purposeOfLoan")} error={errors.purposeOfLoan?.message} />
    <InputField label="BVN Number" {...register("bvn")} error={errors.bvn?.message} />
    <InputField label="Surety 1 Name" {...register("nameOfSurety1")} error={errors.nameOfSurety1?.message} />
    <InputField label="Surety 1 Members No" {...register("surety1MembersNo")} error={errors.surety1MembersNo?.message} />
    <InputField label="Surety 1 Phone Number" {...register("surety1telePhone")} error={errors.surety1telePhone?.message} />
    <InputField label="Surety 2 Name" {...register("nameOfSurety2")} error={errors.nameOfSurety2?.message} />
    <InputField label="Surety 2 Members No" {...register("surety2MembersNo")} error={errors.surety2MembersNo?.message} />
    <InputField label="Surety 2 Phone Number" {...register("surety2telePhone")} error={errors.surety2telePhone?.message} />
    <button type="submit" disabled={loading} className="btn btn-primary">Submit</button>
    {submitError && <div className="error-message">{submitError}</div>}
  </form>
  );
};

export default LoanForm;
