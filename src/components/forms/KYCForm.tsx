"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import InputField from "../InputField";
import SelectField from "../SelectInput";
import { memberSchema, MemberSchema } from "@/lib/formValidationSchemas";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthCOntext";
import CircularProgress from '@mui/material/CircularProgress';
import { auth } from "@/app/api/config";
import { signOut } from "firebase/auth";

const KYCForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<MemberSchema>({
    resolver: zodResolver(memberSchema),
  });

  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [idImgFile, setIdImgFile] = useState<File | null>(null);
  const { role, memberId, getCurrentUserToken } = useAuth();
  const [suretyDetails, setSuretyDetails] = useState<{ name: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [members, setMembers] = useState<any[]>([]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const fetchAllMembers = async () => {
    try {
      const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
      const token = await getCurrentUserToken();

      if (!token) {
        setSubmitError("User not authenticated. Please log in again.");
        return;
      }

      const response = await axios.get(`${serverURL}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setMembers(response.data);
        console.log("Fetched members:", response.data); // Debugging log
      } else {
        setSubmitError("Failed to fetch members.");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      setSubmitError("Error fetching members.");
    }
  };

  useEffect(() => {
    fetchAllMembers();
  }, []);

  const surety1MembersNo = useWatch({ control, name: "surety1MembersNo" });

  useEffect(() => {
    if (surety1MembersNo?.trim()) {
      const member = members.find(m => m.registrationNumber === surety1MembersNo);
      if (member) {
        setSuretyDetails({ name: member.surname + ' ' + member.firstName });
      } else {
        setSuretyDetails(null);
      }
    } else {
      setSuretyDetails(null);
    }
  }, [surety1MembersNo, members]);

  const onSubmit = handleSubmit(async (data) => {
    if (!memberId) {
      setSubmitError("Error: Member ID not found. Please log in again.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("memberId", memberId);

    Object.keys(data).forEach((key) => {
      const value = data[key as keyof MemberSchema];
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (imgFile) {
      formData.append("img", imgFile, "profile_image");
    }

    if (idImgFile) {
      formData.append("idImg", idImgFile, "id_card_image");
    }

    const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

    try {
      const token = await getCurrentUserToken();
      if (!token) {
        setSubmitError("User not authenticated. Please log in again.");
        setSubmitting(false);
        return;
      }

      const response = await axios.post(`${serverURL}/member-kyc`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        handleLogout();
        router.push("/");
      } else {
        setSubmitError(response.data.error || "Failed to submit member KYC form");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setSubmitError(error.response?.data?.error || "Error connecting to the server.");
    } finally {
      setSubmitting(false);
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImgFile(e.target.files[0]);
    }
  };

  const handleIdImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdImgFile(e.target.files[0]);
    }
  };

  return (
    <form className="flex flex-col gap-6 p-4 sm:p-6 md:p-8 lg:p-10" onSubmit={onSubmit}>
      <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">Let us Know More About You</h1>
      <span className="text-xs sm:text-sm text-gray-400 font-medium mb-4">Personal Information</span>

      <div className="flex flex-wrap gap-4">
        <InputField
          label="Middle Name"
          name="middleName"
          register={register}
          error={errors?.middleName}
          className="w-full sm:w-[48%] lg:w-[32%]"
        />
        <InputField
          label="Date of Entry"
          name="dateOfEntry"
          register={register}
          error={errors?.dateOfEntry}
          type="date"
          className="w-full sm:w-[48%] lg:w-[32%]"
        />
      </div>

      <span className="text-xs sm:text-sm text-gray-400 font-medium mb-4">Contact Information</span>
      <div className="flex flex-wrap gap-4">
        <InputField label="Telephone 1" name="telephone1" register={register} error={errors?.telephone1} className="w-full sm:w-[48%] lg:w-[32%]" />
        <InputField label="Telephone 2" name="telephone2" register={register} error={errors?.telephone2} className="w-full sm:w-[48%] lg:w-[32%]" />
        <InputField label="Date of Birth" name="dateOfBirth" register={register} error={errors?.dateOfBirth} type="date" className="w-full sm:w-[48%] lg:w-[32%]" />
        <SelectField
          label="Sex"
          name="sex"
          options={[
            { value: "MALE", label: "Male" },
            { value: "FEMALE", label: "Female" }
          ]}
          register={register}
          error={errors?.sex}
          className="w-full sm:w-[48%] lg:w-[32%]"
        />
        <SelectField
          label="Marital Status"
          name="maritalStatus"
          options={[
            { value: "MARRIED", label: "Married" },
            { value: "SINGLE", label: "Single" },
            { value: "WIDOWED", label: "Widowed" }
          ]}
          register={register}
          error={errors?.maritalStatus}
          className="w-full sm:w-[48%] lg:w-[32%]"
        />
      </div>

      <span className="text-xs sm:text-sm text-gray-400 font-medium mb-4">Other Details</span>
      <div className="flex flex-wrap gap-4">
        <InputField label="Occupation" name="occupation" register={register} error={errors?.occupation} className="w-full sm:w-[48%] lg:w-[32%]" />
        <InputField label="Business" name="business" register={register} error={errors?.business} className="w-full sm:w-[48%] lg:w-[32%]" />
        <InputField label="BVN Number" name="bvn" register={register} error={errors?.bvn} className="w-full sm:w-[48%] lg:w-[32%]" />
        <InputField label="Residential Address" name="residentialAddress" register={register} error={errors?.residentialAddress} className="w-full sm:w-[48%] lg:w-[32%]" />
        <InputField label="LGA" name="lga" register={register} error={errors?.lga} className="w-full sm:w-[48%] lg:w-[32%]" />
        <InputField label="State" name="state" register={register} error={errors?.state} className="w-full sm:w-[48%] lg:w-[32%]" />
        <InputField label="Permanent Home Address" name="permanentHomeAddress" register={register} error={errors?.permanentHomeAddress} className="w-full sm:w-[48%] lg:w-[32%]" />
        <InputField label="State of Origin" name="stateOfOrigin" register={register} error={errors?.stateOfOrigin} className="w-full sm:w-[48%] lg:w-[32%]" />
        <InputField label="LGA 2" name="lga2" register={register} error={errors?.lga2} className="w-full sm:w-[48%] lg:w-[32%]" />
        <InputField label="Amount Paid" name="amountPaid" register={register} error={errors?.amountPaid} className="w-full sm:w-[48%] lg:w-[32%]" />
        <InputField label="Bank Name" name="bankName" register={register} error={errors?.bankName} className="w-full sm:w-[48%] lg:w-[32%]" />
        <InputField label="Account Number" name="accountNumber" register={register} error={errors?.accountNumber} className="w-full sm:w-[48%] lg:w-[32%]" />
      </div>

      <span className="text-xs sm:text-sm text-gray-400 font-medium mb-4">Next of Kin Information</span>
      <div className="flex flex-wrap gap-4">
        <InputField label="Next of Kin Name" name="nextOfKinName" register={register} error={errors?.nextOfKinName} className="w-full sm:w-[48%] lg:w-[32%]" />
        <InputField label="Next of Kin Phone 1" name="nextOfKinPhone" register={register} error={errors?.nextOfKinPhone} className="w-full sm:w-[48%] lg:w-[32%]" />
        <InputField label="Next of Kin Phone 2" name="nextOfKinPhone2" register={register} error={errors?.nextOfKinPhone2} className="w-full sm:w-[48%] lg:w-[32%]" />
        <InputField label="Sponsor" name="sponsor" register={register} error={errors?.sponsor} className="w-full sm:w-[48%] lg:w-[32%]" />
        <InputField
          label="Referrer Number"
          name="surety1MembersNo"
          register={register}
          error={errors?.surety1MembersNo}
          className="w-full sm:w-[48%] lg:w-[32%]"
        />
        {suretyDetails && (
          <div className="w-full sm:w-[48%] lg:w-[32%] p-4 border border-gray-300 rounded-md">
            <p className="text-sm font-medium text-gray-700">Surety Name: {suretyDetails.name}</p>
          </div>
        )}
      </div>

      {/* Image Upload Field */}
      <div className="flex flex-col items-start gap-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
        <label className="text-xs sm:text-sm text-gray-500 flex items-center gap-2 cursor-pointer" htmlFor="profileImage">
          <span className="bg-blue-500 text-white p-2 rounded">Upload Profile Image</span>
        </label>
        <input type="file" id="profileImage" onChange={handleImageChange} accept="image/*" className="hidden" />
        {imgFile && <p className="text-xs sm:text-sm text-green-500">File selected: {imgFile.name}</p>}
        {errors.img?.message && <p className="text-xs text-red-400">{errors.img.message.toString()}</p>}
      </div>

      <div className="flex flex-col items-start gap-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
        <label className="text-xs sm:text-sm text-gray-500 flex items-center gap-2 cursor-pointer" htmlFor="idCardImage">
          <span className="bg-blue-500 text-white p-2 rounded">Upload ID Card Image</span>
        </label>
        <input type="file" id="idCardImage" onChange={handleIdImageChange} accept="image/*" className="hidden" />
        {idImgFile && <p className="text-xs sm:text-sm text-green-500">File selected: {idImgFile.name}</p>}
        {errors.img?.message && <p className="text-xs text-red-400">{errors.idImg.message.toString()}</p>}
      </div>

      <button 
    type="submit" 
    disabled={submitting} 
    className="bg-blue-500 text-white py-2 px-4 rounded-md self-center sm:self-start hover:bg-blue-600 transition flex items-center justify-center"
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

export default KYCForm;
