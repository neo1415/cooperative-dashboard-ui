"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import SelectField from "../SelectInput";
import { cooperativeSchema, CooperativeSchema } from "@/lib/formValidationSchemas";
import { submitCcoperativeForm } from "@/lib/actions";
import Image from "next/image";



const CooperativeForm= () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CooperativeSchema>({
    resolver: zodResolver(cooperativeSchema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    submitCcoperativeForm(data)
  });
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Let is Know More About You</h1>
      <span className="text-xs text-gray-400 font-medium">
  Cooperative Information
</span>
<div className="flex justify-between flex-wrap gap-4">
<InputField
    label="Cooperative Name "
    name="cooperativeName"
    register={register}
    error={errors?.cooperativeName}
  />

  <InputField
    label="Registration Number"
    name="registrationNumber"
    register={register}
    error={errors?.registrationNumber}
  />
  <InputField
    label="Date of Incorporation"
    name="dateOfIncorporation"
    type="date"
    register={register}
    error={errors?.dateOfIncorporation}
  />
  <InputField
    label="Address"
    name="address"
    register={register}
    error={errors?.address}
  />
  <InputField
    label="Email"
    name="email"
    type="email"
    register={register}
    error={errors?.email}
  />
  <InputField
    label="Phone Number"
    name="phoneNumber"
    type="tel"
    register={register}
    error={errors?.phoneNumber}
  />
</div>

<span className="text-xs text-gray-400 font-medium mt-8">
  Director Information
</span>
<div className="flex justify-between flex-wrap gap-4">
  <InputField
    label="Director Name"
    name="directorName"
    register={register}
    error={errors?.directorName}
  />
  <InputField
    label="Director Position"
    name="directorPosition"
    register={register}
    error={errors?.directorPosition}
  />
  <InputField
    label="Director Email"
    name="directorEmail"
    type="email"
    register={register}
    error={errors?.directorEmail}
  />
  <InputField
    label="Director Phone Number"
    name="directorPhoneNumber"
    type="tel"
    register={register}
    error={errors?.directorPhoneNumber}
  />
  <InputField
    label="Director Date of Birth"
    name="directorDateOfBirth"
    type="date"
    register={register}
    error={errors?.directorDateOfBirth}
  />
  <InputField
    label="Director Place of Birth"
    name="directorPlaceOfBirth"
    register={register}
    error={errors?.directorPlaceOfBirth}
  />
  <InputField
    label="Director Nationality"
    name="directorNationality"
    register={register}
    error={errors?.directorNationality}
  />
  <InputField
    label="Director Occupation"
    name="directorOccupation"
    register={register}
    error={errors?.directorOccupation}
  />
  <InputField
    label="Director BVN Number"
    name="directorBVNNumber"
    register={register}
    error={errors?.directorBVNNumber}
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
  />
  <InputField
    label="Director ID Number"
    name="directorIDNumber"
    register={register}
    error={errors?.directorIDNumber}
  />
  <InputField
    label="Director Issued Date"
    name="directorIssuedDate"
    type="date"
    register={register}
    error={errors?.directorIssuedDate}
  />
  <InputField
    label="Director Expiry Date"
    name="directorExpiryDate"
    type="date"
    register={register}
    error={errors?.directorExpiryDate}
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
  />

      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md" onSubmit={onSubmit}>
        {/* {type === "create" ? "Create" : "Update"} */}
        Submit
      </button>
    </form>
  );
};

export default CooperativeForm;