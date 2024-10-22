import { z } from "zod";

export const cooperativeSchema = z.object({
  cooperativeName: z
    .string()
    .min(1, { message: "Cooperative Name is required!" }),

  registrationNumber: z
    .string()
    .min(1, { message: "Registration Number is required!" }),

    dateOfIncorporation: z.preprocess((arg) => {
      if (typeof arg === 'string' || arg instanceof Date) {
        return new Date(arg);
      }
      return arg;
    }, z.date({ message: "Date is required!" })),

  address: z
    .string()
    .min(1, { message: "Address is required!" }),

  email: z
    .string()
    .email({ message: "Invalid email address!" }),

  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits!" })
    .max(14, { message: "Phone number must be at most 14 digits!" }),

  directorName: z
    .string()
    .min(1, { message: "Director name is required!" }),

  directorPosition: z
    .string()
    .min(1, { message: "Director position is required!" }),

  directorEmail: z
    .string()
    .email({ message: "Invalid director email address!" }),

  directorPhoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits!" })
    .max(14, { message: "Phone number must be at most 14 digits!" }),

  directorDateOfBirth: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) {
      return new Date(arg);
    }
    return arg;
  }, z.date({ message: "Director Date of Birth is required!" })),

  directorPlaceOfBirth: z
    .string()
    .min(1, { message: "Director place of birth is required!" }),

  directorNationality: z
    .string()
    .min(1, { message: "Director nationality is required!" }),

  directorOccupation: z
    .string()
    .min(1, { message: "Director occupation is required!" }),

  directorBVNNumber: z
    .string()
    .min(11, { message: "BVN number must be exactly 11 digits!" })
    .max(11, { message: "BVN number must be exactly 11 digits!" }),

    directorIDType: z.enum(["INTERNATIONALPASSPORT", "NIMC", "DRIVERSLISENCE", "VOTERSCARD"], {
      message: "Invalid ID Type!",
    }),

  directorIDNumber: z
    .string()
    .min(1, { message: "Director ID number is required!" }),

  directorIssuedDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be in YYYY-MM-DD format!" }),

  directorExpiryDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be in YYYY-MM-DD format!" }),

  directorSourceOfIncome: z.enum(["SALARYORBUSINESSINCOME", "INVESTMENTSORDIVIDENDS"], {
    message: "Invalid source of income!",
  }),
});

export type CooperativeSchema = z.infer<typeof cooperativeSchema>;


export const memberSchema = z.object({
  // surname: z.string().min(1, { message: "Surname is required!" }),
  // firstName: z.string().min(1, { message: "First Name is required!" }),
  middleName: z.string().min(1, { message: "Middle Name is required!" }),
  dateOfEntry:z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) {
      return new Date(arg);
    }
    return arg;
  }, z.date({ message: "Date of Entry is required!" })),

  telephone1: z
    .string()
    .min(1, { message: "Telephone 1 is required!" })
    .max(15, { message: "Telephone 1 must be a valid number!" }),
  telephone2: z
    .string()
    .min(1, { message: "Telephone 2 is required!" })
    .max(15, { message: "Telephone 2 must be a valid number!" }),
    bvn: z
    .string()
    .min(11, { message: "BVN Number must be 11 digits!" })
    .max(11, { message: "BVN Number must be 11 digits!" }),
  // email: z.string().email({ message: "Invalid email address!" }),
  dateOfBirth: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) {
      return new Date(arg);
    }
    return arg;
  }, z.date({ message: "Date of Birth is required!" })),

  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  maritalStatus: z.enum(["MARRIED", "SINGLE","WIDOWED"], { message: "Sex is required!" }),
  occupation: z.string().min(1, { message: "Occupation is required!" }),
  business: z.string().min(1, { message: "Business is required!" }),
  residentialAddress: z
    .string()
    .min(1, { message: "Residential Address is required!" }),
  lga: z.string().min(1, { message: "LGA is required!" }),
  state: z.string().min(1, { message: "State is required!" }),
  permanentHomeAddress: z
    .string()
    .min(1, { message: "Permanent Home Address is required!" }),
  stateOfOrigin: z.string().min(1, { message: "State of Origin is required!" }),
  lga2: z.string().min(1, { message: "LGA2 is required!" }),
  amountPaid: z.string().min(1, { message: "Amount Paid is required!" }),
  nextOfKinName: z.string().min(1, { message: "Next of Kin Name is required!" }),
  nextOfKinPhone: z
    .string()
    .min(1, { message: "Next of Kin Phone 1 is required!" })
    .max(15, { message: "Next of Kin Phone 1 must be a valid number!" }),
  nextOfKinPhone2: z
    .string()
    .min(1, { message: "Next of Kin Phone 2 is required!" })
    .max(15, { message: "Next of Kin Phone 2 must be a valid number!" }),
  sponsor: z.string().min(1, { message: "Sponsor is required!" }),
  // img: z.string().optional(), // Assuming the image is a URL, make it optional

});

export type MemberSchema = z.infer<typeof memberSchema>;
