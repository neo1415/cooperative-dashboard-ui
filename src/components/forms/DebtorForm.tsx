"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import SelectField from "../SelectInput";
import { useRouter } from "next/navigation";
import { useState } from "react";

const loanSchema = z.object({
  email: z.string().email({ message: "Invalid email address!" }),
  membersRegNo: z.string().min(1, { message: "Registration number is required!" }),
  firstName: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "surname is required!" }),
  middleName: z.string().min(1, { message: "Middle Name is required!" }),
  dateOfEntry: z.date({ message: "Date of Entry is required!" }),
  telephone1: z.string().min(1, { message: "Phone is required!" }),
  telephone2: z.string().min(1, { message: "Phone is required!" }),
  marital: z.enum(["married", "single", "widowed", "engaged"], { message: "Marital Status is required!" }),
  sex: z.enum(["male", "female"], { message: "Sex is required!" }),
  occupation: z.string().min(1, { message: "Occupation is required!" }),
  business: z.string().min(1, { message: "Business is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  lga: z.string().min(1, { message: "lga is required!" }),
  state: z.string().min(1, { message: "State is required!" }),
  homeAddress: z.string().min(1, { message: "Permanent Home Address is required!" }),
  stateOfOrigin: z.string().min(1, { message: "State of Origin is required!" }),
  lga2: z.string().min(1, { message: "lga is required!" }),
  amountPaid: z.string().min(1, { message: "Amount Paid is required!" }),
  kinName: z.string().min(1, { message: "kinName is required!" }),
  kinPhone: z.string().min(1, { message: "kinPhone is required!" }),
  birthday: z.date({ message: "Birthday is required!" }),
  sponsor: z.string().min(1, { message: "Sponsor is required!" }),
  img: z.instanceof(File, { message: "Image is required" }),
});

type LoanSchema = z.infer<typeof loanSchema>;

const DebtorForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoanSchema>({
    resolver: zodResolver(loanSchema),
  });
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const onSubmit = handleSubmit(async (data) => {
    // Retrieve userId instead of cooperativeId if that's the correct key
    const cooperativeId = localStorage.getItem('userId'); // Use 'userId' instead
    
    if (!cooperativeId) {
      setSubmitError('Error: Cooperative ID not found. Please log in again.');
      return;
    }

    const payload = { cooperativeId, ...data };

    const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
    try {
      const response = await fetch(`${serverURL}/loan-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push('/');
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.error || 'Failed to submit cooperative KYC form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Error connecting to the server.');
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Loan Form</h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
  <InputField
    label="Email"
    name="email"
    register={register}
    error={errors?.email}
  />
</div>

<span className="text-xs text-gray-400 font-medium">
  Personal Information
</span>
<div className="flex justify-between flex-wrap gap-4">
  <InputField
    label="Members Reg.No"
    name="membersRegNo"
    register={register}
    error={errors?.membersRegNo}
  />

  <InputField
    label="Surname"
    name="surname"
    register={register}
    error={errors?.surname}
  />

  <InputField
    label="First Name"
    name="firstName"
    register={register}
    error={errors?.firstName}
  />

  <InputField
    label="Middle Name"
    name="middleName"
    register={register}
    error={errors?.middleName}
  />

  <InputField
    label="Date Of Entry"
    name="dateOfEntry"
    type="date"
    register={register}
    error={errors?.dateOfEntry}
  />

  <InputField
    label="Telephone 1"
    name="telephone1"
    register={register}
    error={errors?.telephone1}
  />

  <InputField
    label="Telephone 2"
    name="telephone2"
    register={register}
    error={errors?.telephone2}
  />

  <SelectField
    label="Marital Status"
    name="marital"
    register={register}
    options={[
      { value: "MARRIED", label: "Married" },
      { value: "SINGLE", label: "Single" },
      { value: "WIDOWED", label: "Widowed" },
      { value: "ENGAGED", label: "Engaged" },
    ]}
    error={errors?.marital}
  />

  <SelectField
    label="Sex"
    name="sex"
    register={register}
    error={errors?.sex}
    options={[
      { value: "MALE", label: "Male" },
      { value: "FEMALE", label: "Female" },
    ]}
  />

  <InputField
    label="Occupation"
    name="occupation"
    register={register}
    error={errors?.occupation}
  />

  <InputField
    label="Business"
    name="business"
    register={register}
    error={errors?.business}
  />

  <InputField
    label="Address"
    name="address"
    register={register}
    error={errors?.address}
  />

  <InputField
    label="Local Government Area"
    name="lga"
    register={register}
    error={errors?.lga}
  />

  <InputField
    label="State"
    name="state"
    register={register}
    error={errors?.state}
  />

  <InputField
    label="Permanent Home Address"
    name="homeAddress"
    register={register}
    error={errors?.homeAddress}
  />

  <InputField
    label="State of Origin"
    name="stateOfOrigin"
    register={register}
    error={errors?.stateOfOrigin}
  />

  <InputField
    label="LGA/LCDA"
    name="lga"
    register={register}
    error={errors?.lga}
  />

  <InputField
    label="Amount Paid"
    name="amountPaid"
    type="number"
    register={register}
    error={errors?.amountPaid}
  />

  <InputField
    label="Next of Kin Name"
    name="kinName"
    register={register}
    error={errors?.kinName}
  />

  <InputField
    label="Next of Kin Phone"
    name="kinPhone"
    register={register}
    error={errors?.kinPhone}
  />

  <InputField
    label="Sponsor"
    name="sponsor"
    register={register}
    error={errors?.sponsor}
  />

        {/* <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="img"
          >
            <Image src="/upload.png" alt="" width={28} height={28} />
            <span>Upload a photo</span>
          </label>
          <input type="file" id="img" {...register("img")} className="hidden" />
          {errors.img?.message && (
            <p className="text-xs text-red-400">
              {errors.img.message.toString()}
            </p>
          )}
        </div> */}
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {/* {type === "create" ? "Create" : "Update"} */}
        submit
      </button>
    </form>
  );
};

export default DebtorForm;