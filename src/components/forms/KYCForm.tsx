"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import SelectField from "../SelectInput";
import { memberSchema, MemberSchema } from "@/lib/formValidationSchemas";
import { submitMemberForm } from "@/lib/actions";


const KYCForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberSchema>({
    resolver: zodResolver(memberSchema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    submitMemberForm(data)
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Let is Know More About You</h1>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
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
        label="Date of Entry"
        name="dateOfEntry"
        register={register}
        error={errors?.dateOfEntry}
        type="date"
      />
    </div>

    <span className="text-xs text-gray-400 font-medium">
      Contact Information
    </span>
    <div className="flex justify-between flex-wrap gap-4">
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
      <InputField
        label="Email"
        name="email"
        register={register}
        error={errors?.email}
      />
      <InputField
        label="Date of Birth"
        name="dateOfBirth"
        register={register}
        error={errors?.dateOfBirth}
        type="date"
      />  
      <SelectField
        label="Sex"
        name="sex"
        options={[
          { value: "MALE", label: "Male" },
          { value: "FEMALE", label: "Female" },
        ]}
        register={register}
        error={errors?.sex}
      />

      <SelectField
        label="Marital Status"
        name="maritalStatus"
        options={[
          { value: "MARRIED", label: "Married" },
          { value: "SINGLE", label: "SIngle" },
          { value: "WIDOWED", label: "Widowed" }
        ]}
        register={register}
        error={errors?.maritalStatus}
      />
    </div>

    <span className="text-xs text-gray-400 font-medium">
      Other Details
    </span>
    <div className="flex justify-between flex-wrap gap-4">
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
        label="Residential Address"
        name="residentialAddress"
        register={register}
        error={errors?.residentialAddress}
      />
      <InputField
        label="LGA"
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
        name="permanentHomeAddress"
        register={register}
        error={errors?.permanentHomeAddress}
      />
      <InputField
        label="State of Origin"
        name="stateOfOrigin"
        register={register}
        error={errors?.stateOfOrigin}
      />
      <InputField
        label="LGA 2"
        name="lga2"
        register={register}
        error={errors?.lga2}
      />
      <InputField
        label="Amount Paid"
        name="amountPaid"
        register={register}
        error={errors?.amountPaid}
      />
    </div>

    <span className="text-xs text-gray-400 font-medium">
      Next of Kin Information
    </span>
    <div className="flex justify-between flex-wrap gap-4">
      <InputField
        label="Next of Kin Name"
        name="nextOfKinName"
        register={register}
        error={errors?.nextOfKinName}
      />
      <InputField
        label="Next of Kin Phone 1"
        name="nextOfKinPhone"
               register={register}
        error={errors?.nextOfKinPhone}
      />
      <InputField
        label="Next of Kin Phone 2"
        name="nextOfKinPhone2"
        register={register}
        error={errors?.nextOfKinPhone2}
      />
      <InputField
        label="Sponsor"
        name="sponsor"
        register={register}
        error={errors?.sponsor}
      />
    </div>
      <button className="bg-blue-400 text-white p-2 rounded-md" onClick={onSubmit}>
        Submit
      </button>
    </form>
  );
};

export default KYCForm;