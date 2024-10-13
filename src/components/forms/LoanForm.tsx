"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import InputField from "../InputField";
import { useRouter } from "next/navigation";

// Zod schema to validate the form
const schema = z.object({
  amountRequired: z.string().min(1, { message: "Amount Required is required!" }),
  purposeOfLoan: z.string().min(1, { message: "Purpose of Loan is required!" }),
  durationOfLoan: z
    .number()
    .min(1, { message: "Duration (in months) is required!" })
    .max(60, { message: "Duration cannot exceed 60 months" }),
  bvnNumber: z
    .string()
    .min(11, { message: "BVN Number must be 11 digits!" })
    .max(11, { message: "BVN Number must be 11 digits!" }),
  nameOfSurety1: z.string().min(1, { message: "Surety 1 Name is required!" }),
  surety1MembersNo: z
    .string()
    .min(1, { message: "Surety 1 Members No is required!" }),
  surety1telePhone: z
    .string()
    .min(10, { message: "Surety 1 Phone number must be 10-15 digits!" })
    .max(15, { message: "Surety 1 Phone number must be 10-15 digits!" }),
  nameOfSurety2: z.string().min(1, { message: "Surety 2 Name is required!" }),
  surety2MembersNo: z
    .string()
    .min(1, { message: "Surety 2 Members No is required!" }),
  surety2telePhone: z
    .string()
    .min(10, { message: "Surety 2 Phone number must be 10-15 digits!" })
    .max(15, { message: "Surety 2 Phone number must be 10-15 digits!" }),
});

export type Inputs = z.infer<typeof schema>;

const LoanForm = () => {
  const [memberData, setMemberData] = useState<any>(null); // Store member details
  const [interestRate] = useState(10); // 10% fixed interest rate
  const [amountToBePaidBack, setAmountToBePaidBack] = useState(0);
  const [expectedReimbursementDate, setExpectedReimbursementDate] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } =  useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const amountRequired = watch("amountRequired");
  const durationOfLoan = watch("durationOfLoan");

  // Fetch member data on component mount
  useEffect(() => {
    const fetchMemberData = async () => {
      const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${serverURL}/members`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setMemberData(data); // Set member data
      } catch (error) {
        console.error("Error fetching member details:", error);
      }
    };
    fetchMemberData();
  }, []);

  // Calculate amount to be paid back and reimbursement date
  useEffect(() => {
    if (amountRequired && durationOfLoan) {
      const principal = parseFloat(amountRequired);
      const interest = (principal * interestRate * durationOfLoan) / 12 / 100;
      const total = principal + interest;

      // Set calculated values
      setAmountToBePaidBack(total);

      const now = new Date();
      const reimbursementDate = new Date(now.setMonth(now.getMonth() + durationOfLoan));
      setExpectedReimbursementDate(reimbursementDate.toISOString().split("T")[0]); // Format as YYYY-MM-DD
    }
  }, [amountRequired, durationOfLoan, interestRate]);

  // Submit loan request
  const onSubmit = handleSubmit(async (data) => {
    const cooperativeId = localStorage.getItem("cooperativeId"); // Fetch cooperativeId

    const payload = {
      ...data,
      cooperativeId,
      firstName: memberData?.firstName,
      surname: memberData?.surname,
      email: memberData?.email,
      bvnNumber: memberData?.bvnNumber || data.bvnNumber, // Fallback to form if missing
      amountToBePaidBack,
      expectedReimbursementDate,
    };
    const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
    try {
      const response = await fetch(`${serverURL}/loan-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/success");
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("Error submitting loan request:", error);
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Loan Request</h1>

      {/* Auto-fill KYC Data */}
      <div className="flex justify-between flex-wrap gap-4">
        <InputField label="First Name" name="firstName" defaultValue={memberData?.firstName} disabled />
        <InputField label="Surname" name="surname" defaultValue={memberData?.surname} disabled />
        <InputField label="Email" name="email" defaultValue={memberData?.email} disabled />
      </div>

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
  register={(name: keyof Inputs) => register(name, { valueAsNumber: true })}  // Correctly type 'name' as keyof Inputs
  error={errors?.durationOfLoan}
  type="number"
  inputProps={{ step: "1" }}  // Optionally define step for number input
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

      {/* Dynamic Calculations */}
      <div>
        <InputField
          label="Amount to Be Paid Back"
          name="amountToBePaidBack"
          defaultValue={amountToBePaidBack.toFixed(2)}
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
