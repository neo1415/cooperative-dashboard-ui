"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" }),
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

type Inputs = z.infer<typeof schema>;

const DebtorForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Loan Form</h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">

        <InputField
          label="Members Reg.No"
          name="membersRegNo"
          defaultValue={data?.membersRegNo}
          register={register}
          error={errors.membersRegNo}
        />

        <InputField
          label="Surname"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors.surname}
        />
        <InputField
          label="First Name"
          name="firstName"
          defaultValue={data?.firstName}
          register={register}
          error={errors.firstName}
        />
        <InputField
          label="Middle Name"
          name="middleName"
          defaultValue={data?.lastName}
          register={register}
          error={errors.middleName}
        />
        <InputField
          label="Date Of Entry"
          name="dateOfEntry"
          defaultValue={data?.dateOfEntry}
          register={register}
          error={errors.dateOfEntry}
          type="date"
        />
        <InputField
          label="TelePhone 1"
          name="telephone1"
          defaultValue={data?.telephone1}
          register={register}
          error={errors.telephone1}
        />
        <InputField
          label="TelePhone 2"
          name="telephone2"
          defaultValue={data?.telephone2}
          register={register}
          error={errors.telephone2}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Marital Status</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.marital}
          >
            <option value="male">Married</option>
            <option value="single">Single</option>
            <option value="widowed">Widowed</option>
            <option value="engaged">Engaged</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>

        <InputField
          label="Occupation"
          name="occupation"
          defaultValue={data?.occupation}
          register={register}
          error={errors.occupation}
        />

        <InputField
          label="Business"
          name="business"
          defaultValue={data?.business}
          register={register}
          error={errors.business}
        />

        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Local Government Area"
          name="lga"
          defaultValue={data?.lga}
          register={register}
          error={errors.lga}
        />

        <InputField
          label="State"
          name="state"
          defaultValue={data?.state}
          register={register}
          error={errors.state}
        />

        <InputField
          label="Permanent Home Address"
          name="homeAddress"
          defaultValue={data?.homeAddress}
          register={register}
          error={errors.homeAddress}
        />

        <InputField
          label="State of Origin"
          name="stateOfOrigin"
          defaultValue={data?.stateOfOrigin}
          register={register}
          error={errors.stateOfOrigin}
        />

        <InputField
          label="LGA/LCDA"
          name="lga1"
          defaultValue={data?.lga2}
          register={register}
          error={errors.lga2}
          />

        <InputField
          label="Amount Paid"
          name="amountPaid"
          defaultValue={data?.amountPaid}
          register={register}
          error={errors.amountPaid}
          type="date"
        />

        <InputField
          label="Next of Kin Name"
          name="kinName"
          defaultValue={data?.kinName}
          register={register}
          error={errors.kinName}
          type="date"
        />

        <InputField
          label="Next of Kin Phone"
          name="kinPhone"
          defaultValue={data?.kinPhone}
          register={register}
          error={errors.kinPhone}
          type="date"
        />

        <InputField
          label="Sponsor"
          name="sponsor"
          defaultValue={data?.sponsor}
          register={register}
          error={errors.sponsor}
          type="date"
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
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
        </div>
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default DebtorForm;