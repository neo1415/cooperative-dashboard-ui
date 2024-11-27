"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import SelectField from "../SelectInput";
import { cooperativeSchema, CooperativeSchema } from "@/lib/formValidationSchemas";
import { submitCcoperativeForm } from "@/lib/actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthCOntext";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import { auth } from "@/app/api/config";
import { signOut } from "firebase/auth";



const CooperativeForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CooperativeSchema>({
    resolver: zodResolver(cooperativeSchema),
  });
  
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imgFile, setImgFile] = useState<File | null>(null); // New state for image file
  const { role, cooperativeId, getCurrentUserToken } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login'); // Redirect to login page after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!cooperativeId) {
      setSubmitError("Error: Cooperative ID not found. Please log in again.");
      return;
    }
  
    setSubmitting(true);  // Start loading state
    const formData = new FormData();
    formData.append("cooperativeId", cooperativeId);
  
    // Log data to be sent
    console.log("Form Data (before appending):", data);
  
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof CooperativeSchema];
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });
  
    if (imgFile) {
      formData.append("img", imgFile);
    }
  
    const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
  
    try {
      const token = await getCurrentUserToken();
      if (!token) {
        setSubmitError("User not authenticated. Please log in again.");
        setSubmitting(false);
        return;
      }
  
      // Log token being sent
      console.log("Authorization Token:", token);
  
      const response = await axios.post(`${serverURL}/cooperative-kyc`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        handleLogout()
        router.push("/");
      } else {
        setSubmitError(response.data.error || "Failed to submit member KYC form");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setSubmitError(error.response?.data?.error || "Error connecting to the server.");
    } finally {
      setSubmitting(false); // End loading state
    }
  });
  
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImgFile(e.target.files[0]);
    }
  };

  
  return (
    <form className="flex flex-col gap-8 p-4 md:p-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Let us Know More About You</h1>
  
      {/* Cooperative Information Section */}
      <span className="text-xs text-gray-400 font-medium">Cooperative Information</span>
      <div className="flex flex-wrap gap-4">
        {/* <InputField
          label="Cooperative Name"
          name="cooperativeName"
          register={register}
          error={errors?.cooperativeName}
          className="w-full md:w-[48%] lg:w-[32%]"
        />
        <InputField
          label="Registration Number"
          name="registrationNumber"
          register={register}
          error={errors?.registrationNumber}
          className="w-full md:w-[48%] lg:w-[32%]"
        /> */}
        <InputField
          label="Date of Incorporation"
          name="dateOfIncorporation"
          type="date"
          register={register}
          error={errors?.dateOfIncorporation}
          className="w-full md:w-[48%] lg:w-[32%]"
        />
        <InputField
          label="Address"
          name="address"
          register={register}
          error={errors?.address}
          className="w-full"
        />
        {/* <InputField
          label="Email"
          name="email"
          type="email"
          register={register}
          error={errors?.email}
          className="w-full md:w-[48%]"
        /> */}
        <InputField
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          register={register}
          error={errors?.phoneNumber}
          className="w-full md:w-[48%]"
        />
      </div>
  
      {/* Director Information Section */}
      <span className="text-xs text-gray-400 font-medium mt-8">Director Information</span>
      <div className="flex flex-wrap gap-4">
        <InputField
          label="Director Name"
          name="directorName"
          register={register}
          error={errors?.directorName}
          className="w-full md:w-[48%]"
        />
        <InputField
          label="Director Position"
          name="directorPosition"
          register={register}
          error={errors?.directorPosition}
          className="w-full md:w-[48%]"
        />
        <InputField
          label="Director Email"
          name="directorEmail"
          type="email"
          register={register}
          error={errors?.directorEmail}
          className="w-full md:w-[48%]"
        />
        <InputField
          label="Director Phone Number"
          name="directorPhoneNumber"
          type="tel"
          register={register}
          error={errors?.directorPhoneNumber}
          className="w-full md:w-[48%]"
        />
        <InputField
          label="Director Date of Birth"
          name="directorDateOfBirth"
          type="date"
          register={register}
          error={errors?.directorDateOfBirth}
          className="w-full md:w-[48%]"
        />
        <InputField
          label="Director Place of Birth"
          name="directorPlaceOfBirth"
          register={register}
          error={errors?.directorPlaceOfBirth}
          className="w-full md:w-[48%]"
        />
        <InputField
          label="Director Nationality"
          name="directorNationality"
          register={register}
          error={errors?.directorNationality}
          className="w-full md:w-[48%]"
        />
        <InputField
          label="Director Occupation"
          name="directorOccupation"
          register={register}
          error={errors?.directorOccupation}
          className="w-full md:w-[48%]"
        />
        <InputField
          label="Director BVN Number"
          name="directorBVNNumber"
          register={register}
          error={errors?.directorBVNNumber}
          className="w-full md:w-[48%]"
        />
        <SelectField
          label="Director ID Type"
          name="directorIDType"
          register={register}
          options={[
            { value: "INTERNATIONALPASSPORT", label: "International Passport" },
            { value: "NIMC", label: "NIMC" },
            { value: "DRIVER_LICENSE", label: "Driver's License" },
            { value: "VOTERSCARD", label: "Voter's Card" }
          ]}
          error={errors?.directorIDType}
          className="w-full md:w-[48%]"
        />
        <InputField
          label="Director ID Number"
          name="directorIDNumber"
          register={register}
          error={errors?.directorIDNumber}
          className="w-full md:w-[48%]"
        />
        <InputField
          label="Director Issued Date"
          name="directorIssuedDate"
          type="date"
          register={register}
          error={errors?.directorIssuedDate}
          className="w-full md:w-[48%]"
        />
        <InputField
          label="Director Expiry Date"
          name="directorExpiryDate"
          type="date"
          register={register}
          error={errors?.directorExpiryDate}
          className="w-full md:w-[48%]"
        />
        <SelectField
          label="Director Source of Income"
          name="directorSourceOfIncome"
          options={[
            { value: "SALARYORBUSINESSINCOME", label: "Salary or Dividends" },
            { value: "INVESTMENTSORDIVIDENDS", label: "Investments or Dividends" },
            { value: "INVESTMENT", label: "Investment" }
          ]}
          register={register}
          error={errors?.directorSourceOfIncome}
          className="w-full md:w-[48%]"
        />
        
        {/* Image Upload Field */}
        <div className="flex flex-col gap-2 w-full md:w-[48%] lg:w-[32%] justify-center">
          <label className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer" htmlFor="img">
            <span className="bg-blue-500 text-white p-2 rounded">Upload Profile Image</span>
          </label>
          <input type="file" id="img" onChange={handleImageChange} accept="image/*" className="hidden" />
          {imgFile && <p className="text-sm text-green-500">File selected: {imgFile.name}</p>}
          {errors.img?.message && <p className="text-xs text-red-400">{errors.img.message.toString()}</p>}
        </div>
      </div>
  
      {/* Submit Button */}
      <button 
    type="submit" 
    disabled={submitting} 
    className="bg-blue-400 text-white p-2 rounded-md w-full md:w-[48%] lg:w-[32%] flex justify-center items-center"
  >
    {submitting ? (
      <>
        <CircularProgress size={20} style={{ color: 'white', marginRight: '8px' }} />
        Submitting...
      </>
    ) : (
      "Submit"
    )}
  </button>
    </form>
  );
  
};

export default CooperativeForm;