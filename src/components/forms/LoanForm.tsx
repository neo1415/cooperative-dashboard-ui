"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import InputField from "../InputField";
import { Modal, Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthCOntext";
import { auth } from "@/app/api/config";
import CircularProgress from '@mui/material/CircularProgress';
import { browserSessionPersistence, setPersistence } from "firebase/auth";

interface Range {
  min: number;
  max: number;
  rate: number;
}

interface Setting {
  id: string;
  minDurationMonths: number | null;
  maxDurationMonths: number | null;
  durationInterestRate: number | null;
  minAmount: number | null;
  maxAmount: number | null;
  amountInterestRate: number | null;
}

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

const LoanFormModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [loanInterest, setLoanInterest] = useState(10);
  const [amountGranted, setAmountGranted] = useState(0);
  const [expectedAmountToBePaidBack, setExpectedAmountToBePaidBack] = useState<number>(0);
  const [amountInterestRate, setAmountInterestRate] = useState(loanInterest);
  const [durationInterestRate, setDurationInterestRate] = useState(loanInterest);
  const [expectedReimbursementDate, setExpectedReimbursementDate] = useState("");
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [amountRanges, setAmountRanges] = useState<Range[]>([]);
  const [durationRanges, setDurationRanges] = useState<Range[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);
  const { role, cooperativeId, memberId, getCurrentUserToken } = useAuth();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const amountRequired = watch("amountRequired");
  const durationOfLoan = watch("durationOfLoan");

  useEffect(() => {
    const fetchSettings = async () => {
      if (role === 'cooperative-admin' || role === 'member') {
        console.log("Fetching loan settings for role:", role);

        try {
          await setPersistence(auth, browserSessionPersistence);
          auth.onAuthStateChanged(async (user) => {
            if (user) {
              const token = await user.getIdToken();
              console.log("Token obtained:", token);

              const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/fetch-loan-interest-settings`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });

              if (response.status === 200) {
                console.log("Loan settings fetched successfully:", response.data);

                const fetchedSettings: Setting[] = response.data.map((setting: any) => ({
                  ...setting,
                  id: String(setting.id),
                }));
                setSettings(fetchedSettings);
              } else {
                throw new Error('Failed to fetch settings');
              }
            }
          });
        } catch (error) {
          console.error("Persistence error:", error);
        }
      }
    };

    fetchSettings();
  }, [role]);

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
    console.log('Settings updated:', settings);
  }, [settings]);

  useEffect(() => {
    if (amountRequired && durationOfLoan) {
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

      setAmountInterestRate(amountRate);
      setDurationInterestRate(durationRate);

      console.log("Selected amount range rate:", amountRate);
      console.log("Selected duration range rate:", durationRate);

      // Consolidate both rates into a single loan interest value
      const totalInterestRate = (amountRate + durationRate) / 2;
      setLoanInterest(totalInterestRate);

      const interest = amount * Math.pow((1 + totalInterestRate / 100), duration / 12) - amount;
      setAmountGranted(amount + interest);

      console.log("Calculated interest:", interest);
      console.log("Total amount granted:", amount + interest);

      const now = new Date();
      const reimbursementDate = new Date(now.setMonth(now.getMonth() + duration));
      setExpectedReimbursementDate(reimbursementDate.toISOString().split("T")[0]);
      console.log("Expected reimbursement date:", reimbursementDate.toISOString().split("T")[0]);
    }
  }, [amountRequired, durationOfLoan, amountRanges, durationRanges, loanInterest]);


  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log('cooperativeId:', cooperativeId);
    console.log('memberId:', memberId);
  
    if (!memberId) {
      setSubmitError('Error: Cooperative or Member ID not found. Please log in again.');
      return;
    }
  
    setSubmitting(true);  // Start loading state
  
    const payload = {
      cooperativeId,
      memberId,
      amountRequired: parseInt(data.amountRequired, 10),
      purposeOfLoan: data.purposeOfLoan,
      durationOfLoan: parseInt(data.durationOfLoan, 10),
      bvn: data.bvn,
      nameOfSurety1: data.nameOfSurety1,
      surety1MembersNo: data.surety1MembersNo,
      surety1telePhone: data.surety1telePhone,
      nameOfSurety2: data.nameOfSurety2,
      surety2MembersNo: data.surety2MembersNo,
      surety2telePhone: data.surety2telePhone,
      amountGranted: Math.round(amountGranted),
      loanInterest,
      expectedAmountToBePaidBack: Math.round(expectedAmountToBePaidBack)
    };
  
    console.log('Payload:', payload);
  
    const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
  
    try {
      const token = await getCurrentUserToken();
      if (!token) {
        throw new Error('User not authenticated. Please log in again.');
      }
  
      const response = await axios.post(`${serverURL}/loan-request`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        router.push('/member');
      } else {
        setSubmitError(response.data.error || 'Failed to submit loan request');
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setSubmitError(error.response?.data?.error || error.message || 'Error connecting to the server.');
    } finally {
      setSubmitting(false); // End loading state
    }
  };
  
  const [submitting, setSubmitting] = useState(false);

  

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Open Loan Request Form
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%", // Adjusted for responsiveness
            maxWidth: 600, // Maximum width for larger screens
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-xl font-semibold">Loan Request</h1>
  
            {/* Loan Details Section */}
            <span className="text-xs text-gray-400 font-medium">Loan Details</span>
            <div className="flex flex-wrap gap-4">
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
  
            {/* Calculated Fields Display */}
            {amountRequired && durationOfLoan && (
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="bg-gray-100 p-4 rounded shadow flex-1">
                  <label className="font-medium">Total Amount to Be Paid Back:</label>
                  <div>{amountGranted.toFixed(2)}</div>
                </div>
                <div className="bg-gray-100 p-4 rounded shadow flex-1">
                  <label className="font-medium">Loan Interest Rate (%):</label>
                  <div>{loanInterest.toFixed(2)}</div>
                </div>
                <div className="bg-gray-100 p-4 rounded shadow flex-1">
                  <label className="font-medium">Expected Reimbursement Date:</label>
                  <div>{expectedReimbursementDate}</div>
                </div>
              </div>
            )}
  
            {/* Surety Information */}
            <span className="text-xs text-gray-400 font-medium">Surety Information</span>
            <div className="flex flex-wrap gap-4">
              <InputField
                label="BVN"
                name="bvn"
                register={register}
                error={errors?.bvn}
              />
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
  
            <button
    type="submit"
    disabled={submitting}
    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition flex items-center justify-center"
  >
    {submitting ? (
      <>
        <CircularProgress size={20} style={{ color: 'white', marginRight: '8px' }} />
        Submitting Loan Request...
      </>
    ) : (
      "Submit Loan Request"
    )}
  </button>

          </form>
        </Box>
      </Modal>
    </>
  );
  
};

export default LoanFormModal;


