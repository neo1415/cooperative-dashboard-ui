"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
  id: z.string().uuid().optional(), // The id will be automatically generated with a default uuid
  surname: z.string().min(1, { message: "Surname is required!" }),
  firstName: z.string().min(1, { message: "First Name is required!" }),
  middleName: z.string().optional(), // Optional field
  amountRequired: z.string().min(1, { message: "Amount Required is required!" }),
  purposeOfLoan: z.string().min(1, { message: "Purpose of Loan is required!" }),
  dateOfApplication: z.string().min(1, { message: "Date of Application is required!" }), // You may want to validate as a date if needed
  bvnNumber: z
    .string()
    .min(11, { message: "BVN Number must be 11 digits!" })
    .max(11, { message: "BVN Number must be 11 digits!" }),
  nameOfSurety1: z.string().min(1, { message: "Name of Surety 1 is required!" }),
  surety1MembersNo: z.string().min(1, { message: "Surety 1 Members No is required!" }),
  surety1telePhone: z
    .string()
    .min(10, { message: "Surety 1 Phone number must be at least 10 digits!" })
    .max(15, { message: "Surety 1 Phone number must be less than 15 digits!" }),
  nameOfSurety2: z.string().min(1, { message: "Name of Surety 2 is required!" }),
  surety2MembersNo: z.string().min(1, { message: "Surety 2 Members No is required!" }),
  surety2telePhone: z
    .string()
    .min(10, { message: "Surety 2 Phone number must be at least 10 digits!" })
    .max(15, { message: "Surety 2 Phone number must be less than 15 digits!" }),
});

export type Inputs = z.infer<typeof schema>;

const LoanForm = () => {
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
      <h1 className="text-xl font-semibold">Let is Know More About You</h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
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
        label="Date of Application"
        name="dateOfApplication"
        register={register}
        error={errors?.dateOfApplication}
        type="date"
      />
    </div>

    {/* BVN and Sureties Section */}
    <span className="text-xs text-gray-400 font-medium">BVN and Sureties Information</span>
    <div className="flex justify-between flex-wrap gap-4">
      <InputField
        label="BVN Number"
        name="bvnNumber"
        register={register}
        error={errors?.bvnNumber}
      />
      <InputField
        label="Surety 1 Name"
        name="nameOfSurety1"
        register={register}
        error={errors?.nameOfSurety1}
      />
      <InputField
        label="Surety 1 Members No"
        name="surety1MembersNo"
        register={register}
        error={errors?.surety1MembersNo}
      />
      <InputField
        label="Surety 1 Telephone"
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
        label="Surety 2 Members No"
        name="surety2MembersNo"
        register={register}
        error={errors?.surety2MembersNo}
      />
      <InputField
        label="Surety 2 Telephone"
        name="surety2telePhone"
        register={register}
        error={errors?.surety2telePhone}
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
      <button className="bg-blue-400 text-white p-2 rounded-md" onClick={onSubmit}>
        Submit
      </button>
    </form>
  );
};

export default LoanForm;