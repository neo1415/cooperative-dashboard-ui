"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import InputField from "../InputField";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthCOntext";
import { auth } from "@/app/api/config";
import { browserSessionPersistence, setPersistence } from "firebase/auth";

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


// Zod schema to validate the form
const schema = z.object({
  amountRequired: z.string().min(1, { message: "Amount Required is required!" }),
  purposeOfLoan: z.string().min(1, { message: "Purpose of Loan is required!" }),
  durationOfLoan: z.string().min(1, { message: "Duration of Loan is required!" }),
  bvn: z.string().length(11, { message: "BVN Number must be exactly 11 digits!" }),
  nameOfSurety1: z.string().min(1, { message: "Surety 1 Name is required!" }),
  surety1MembersNo: z.string().min(1, { message: "Surety 1 Members No is required!" }),
  surety1telePhone: z.string().min(10, { message: "Surety 1 Phone number must be 10-15 digits!" }).max(15, { message: "Surety 1 Phone number must be 10-15 digits!" }),
  nameOfSurety2: z.string().min(1, { message: "Surety 2 Name is required!" }),
  surety2MembersNo: z.string().min(1, { message: "Surety 2 Members No is required!" }),
  surety2telePhone: z.string().min(10, { message: "Surety 2 Phone number must be 10-15 digits!" }).max(15, { message: "Surety 2 Phone number must be 10-15 digits!" }),
});

export type Inputs = z.infer<typeof schema>;

const LoanForm = () => {
  const [loanInterest, setLoanInterest] = useState(10); // Default interest rate
  const [amountGranted, setAmountGranted] = useState(0);
  const [expectedReimbursementDate, setExpectedReimbursementDate] = useState("");
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [amountRanges, setAmountRanges] = useState<Range[]>([]);
  const [durationRanges, setDurationRanges] = useState<Range[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);
  const { role } = useAuth(); // Custom hook to fetch user role

  const { register, handleSubmit, formState: { errors }, watch } = useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const amountRequired = watch("amountRequired");
  const durationOfLoan = watch("durationOfLoan");

  // Fetch loan settings based on user role
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

  // Set ranges based on fetched settings
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

  // Calculate amount to be paid back and reimbursement date
  useEffect(() => {
    if (amountRequired && durationOfLoan && settings.length > 0) {
      const amount = parseFloat(amountRequired);
      const duration = parseInt(durationOfLoan);

      const selectedAmountRange = amountRanges.find((range) =>
        amount >= range.min && amount <= range.max
      );
      const selectedDurationRange = durationRanges.find((range) =>
        duration >= range.min && duration <= range.max
      );

      const amountRate = selectedAmountRange?.rate ?? loanInterest;
      const durationRate = selectedDurationRange?.rate ?? loanInterest;

      const totalInterestRate = (amountRate + durationRate) / 2;
      const interest = amount * Math.pow((1 + totalInterestRate / 100), duration / 12) - amount;
      setAmountGranted(amount + interest);

      const now = new Date();
      const reimbursementDate = new Date(now.setMonth(now.getMonth() + duration));
      setExpectedReimbursementDate(reimbursementDate.toISOString().split("T")[0]);
    }
  }, [amountRequired, durationOfLoan, amountRanges, durationRanges, loanInterest, settings]);

  // Submit loan request
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
      <h1 className="text-xl font-semibold">Loan Request</h1>

      {/* Loan Details Section */}
      <span className="text-xs text-gray-400 font-medium">Loan Details</span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Amount Required"
          name="amountRequired"
          register={register}
          error={errors?.amountRequired}
        />
        <InputField
          label="Purpose of Loan"
          name="purposeOfLoan"
          register={register}
          error={errors?.purposeOfLoan}
        />
        <InputField
          label="Duration of Loan (months)"
          name="durationOfLoan"
          register={register}
          error={errors?.durationOfLoan}
          type="number"
        />
      </div>

      {/* Surety Information */}
      <span className="text-xs text-gray-400 font-medium">Surety Information</span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Surety 1 Name"
          name="nameOfSurety1"
          register={register}
          error={errors?.nameOfSurety1}
        />
        <InputField
          label="Surety 1 Member Number"
          name="surety1MembersNo"
          register={register}
          error={errors?.surety1MembersNo}
        />
        <InputField
          label="Surety 1 Phone"
          name="surety1telePhone"
          register={register}
          error={errors?.surety1telePhone}
        />
        <InputField
          label="Surety 2 Name"
          name="nameOfSurety2"
          register={register}
          error={errors?.nameOfSurety2}
        />
        <InputField
          label="Surety 2 Member Number"
          name="surety2MembersNo"
          register={register}
          error={errors?.surety2MembersNo}
        />
        <InputField
          label="Surety 2 Phone"
          name="surety2telePhone"
          register={register}
          error={errors?.surety2telePhone}
        />
      </div>

      {submitError && <span className="text-red-500">{submitError}</span>}

      <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
        Submit Loan Request
      </button>
    </form>
  );
};

export default LoanForm;
