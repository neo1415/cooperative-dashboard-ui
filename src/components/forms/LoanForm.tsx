"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import InputField from "../InputField";
import { useRouter } from "next/navigation";
import axios from "axios";

// Zod schema to validate the form
const schema = z.object({
  amountRequired: z.string().min(1, { message: "Amount Required is required!" }),
  purposeOfLoan: z.string().min(1, { message: "Purpose of Loan is required!" }),
  durationOfLoan:  z.string().min(1, { message: "Purpose of Loan is required!" }),
  bvn: z
    .string()
    .length(11, { message: "BVN Number must be exactly 11 digits!" }),
  nameOfSurety1: z.string().min(1, { message: "Surety 1 Name is required!" }),
  surety1MembersNo: z.string().min(1, { message: "Surety 1 Members No is required!" }),
  surety1telePhone: z
    .string()
    .min(10, { message: "Surety 1 Phone number must be 10-15 digits!" })
    .max(15, { message: "Surety 1 Phone number must be 10-15 digits!" }),
  nameOfSurety2: z.string().min(1, { message: "Surety 2 Name is required!" }),
  surety2MembersNo: z.string().min(1, { message: "Surety 2 Members No is required!" }),
  surety2telePhone: z
    .string()
    .min(10, { message: "Surety 2 Phone number must be 10-15 digits!" })
    .max(15, { message: "Surety 2 Phone number must be 10-15 digits!" }),
});

export type Inputs = z.infer<typeof schema>;

const LoanForm = () => {
  const [loanInterest] = useState(10); // 10% fixed interest rate
  const [amountGranted, setAmountGranted] = useState(0);
  const [expectedReimbursementDate, setExpectedReimbursementDate] = useState("");
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const amountRequired = watch("amountRequired");
  const durationOfLoan = watch("durationOfLoan");

  // Calculate amount to be paid back and reimbursement date
  useEffect(() => {
    if (amountRequired && durationOfLoan) {
      const principal = parseFloat(amountRequired);
      const duration = parseFloat(durationOfLoan.toString());  // Ensure it's parsed correctly as a float
      const interest = (principal * loanInterest * duration) / 12 / 100;
      const total = principal + interest;

      // Set calculated values
      setAmountGranted(total);

      const now = new Date();
      const reimbursementDate = new Date(now.setMonth(now.getMonth() + duration));
      setExpectedReimbursementDate(reimbursementDate.toISOString().split("T")[0]); // Format as YYYY-MM-DD
    }
  }, [amountRequired, durationOfLoan, loanInterest]);

  // Submit loan request
  const onSubmit = handleSubmit(async (data) => {
    const memberId = localStorage.getItem('userId'); // Get member ID from local storage
    const cooperativeId = localStorage.getItem('cooperativeId'); // Get cooperative ID from local storage
    
    if (!cooperativeId || !memberId) {
      setSubmitError('Error: Cooperative or Member ID not found. Please log in again.');
      return;
    }
  
    const payload = {
      memberId,
      cooperativeId,  // Ensure this value is correctly fetched
      ...data,
      amountGranted,
      expectedReimbursementDate,
      loanInterest,
    };
    console.log("Submitting cooperativeId in payload:", cooperativeId);
    console.log("Submitting memberId in payload:", memberId);
  
    const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
  
    try {
      const token = localStorage.getItem("firebaseToken"); // Fetch Firebase token
      const response = await axios.post(`${serverURL}/loan-request`, payload, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass Firebase token to backend
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
          type="number"  // Make sure it's a number input field
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

      <InputField
        label="BVN Number"
        name="bvn"
        register={register}
        error={errors?.bvn}
      />

      {/* Dynamic Calculations */}
      <div>
        <InputField
          label="Amount to Be Paid Back"
          name="amountGranted"
          defaultValue={amountGranted.toFixed(2)}
          disabled
        />
        <InputField
          label="Expected Reimbursement Date"
          name="expectedReimbursementDate"
          defaultValue={expectedReimbursementDate}
          disabled
        />
      </div>

      <button className="bg-blue-400 text-white p-2 rounded-md" type="submit">
        Submit
      </button>
    </form>
  );
};

export default LoanForm;
