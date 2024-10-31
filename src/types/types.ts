export interface Member {
    id: string;
    surname: string;
    firstName: string;
    email: string;
    memberDetails?: MemberDetails; // Optional memberDetails array
  }
  
  // MemberDetails interface
  export interface MemberDetails {
    middleName?: string;
    telephone1: string;
    telephone2?: string;
    sex: string;
    maritalStatus: string;
    occupation: string;
    business: string;
    residentialAddress: string;
    lga: string;
    state: string;
    permanentHomeAddress: string;
    stateOfOrigin: string;
    lga2: string;
    amountPaid: string;
    nextOfKinName: string;
    nextOfKinPhone: string;
    nextOfKinPhone2?: string;
    sponsor: string;
  }

  export interface LoanApprove {
    id: string;
    amountRequired: number;
    purposeOfLoan: string;
    durationOfLoan: number;
    bvn: string;
    nameOfSurety1: string;
    surety1MembersNo: string;
    surety1telePhone: string;
    nameOfSurety2: string;
    surety2MembersNo: string;
    surety2telePhone: string;
    amountGranted?: number;
    loanInterest?: number;
    dateOfApplication: string;
    expectedReimbursementDate: string;
    member: {
      id: string;
      firstName: string;
      surname: string;
      email: string;
    };
    cooperative: {
      id: string;
      cooperativeName: string;
    };
  }
  
  // Define the CooperativeDetails interface
export interface CooperativeDetails {
    registrationNumber: string;
    dateOfIncorporation: string;
    address: string;
    email: string;
    phoneNumber: string;
    totalSavings: number;
    totalDebt: number;
    totalLoansRequested: number;
    totalLoansApproved: number;
    totalProfit: number;
    directorName: string;
    directorPosition: string;
    directorEmail: string;
    directorPhoneNumber: string;
    directorDateOfBirth: string;
    directorPlaceOfBirth: string;
    directorNationality: string;
    directorOccupation: string;
    directorBVNNumber: string;
    directorIDType: string;
    directorIDNumber: string;
    directorIssuedDate: string;
    directorExpiryDate: string;
    directorSourceOfIncome: string;
  }
  
  // Define the Cooperative interface that includes an array of CooperativeDetails
  export interface Cooperative {
    id: string;
    cooperativeName: string;
    createdAt: string;
    cooperativeDetails: CooperativeDetails[]; // CooperativeDetails is an array
  }

 export interface LoanRequest {
    id: string;
    amountRequired: number;
    purposeOfLoan: string;
    durationOfLoan: number;
    bvn: string;
    nameOfSurety1: string;
    surety1MembersNo: string;
    surety1telePhone: string;
    nameOfSurety2: string;
    surety2MembersNo: string;
    surety2telePhone: string;
    amountGranted?: number;
    loanInterest?: number;
    dateOfApplication: string;
    expectedReimbursementDate: string;
    approved?: boolean;
    rejected?: boolean;
    pending?: boolean;
    member: {
      id: string;
      firstName: string;
      surname: string;
      email: string;
    };
    cooperative: {
      id: string;
      cooperativeName: string;
    };
  }