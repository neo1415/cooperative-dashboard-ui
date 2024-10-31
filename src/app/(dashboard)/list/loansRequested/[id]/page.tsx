import { useState, useEffect } from 'react';
import axios from 'axios';

interface LoanRequestDetailProps {
  loanId: string;
  onClose: () => void;
}

// interface LoanRequest {
//   id: string;
//   amountRequired: number;
//   purposeOfLoan: string;
//   durationOfLoan: number;
//   dateOfApplication: string;
//   expectedReimbursementDate: string;
//   member?: {
//     id: string;
//     firstName: string;
//     surname: string;
//     email: string;
//     memberSavings: {
//       savingsBalance: number;
//       savingsDeposits: number;
//     };
//   };
//   // Other properties as needed...
// }

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: string; // e.g., "deposit" or "withdrawal"
}

interface LoanRequest {
  id: string;
  amountRequired: number;
  purposeOfLoan: string;
  durationOfLoan: number;
  dateOfApplication: string;
  expectedReimbursementDate: string;
  transactions?: Transaction[]; // New field for transactions
  member?: {
    id: string;
    firstName: string;
    surname: string;
    email: string;
    memberSavings: {
      savingsBalance: number;
      savingsDeposits: number;
    };
  };
  // Other properties as needed...
}


const LoanRequestDetail: React.FC<LoanRequestDetailProps> = ({ loanId, onClose }) => {
  const [loanRequest, setLoanRequest] = useState<LoanRequest | null>(null);
  const [editableAmount, setEditableAmount] = useState<number>(0);

  useEffect(() => {
    const fetchLoanRequestDetails = async () => {
      try {
        const serverURL = process.env.NEXT_PUBLIC_SERVER_URL?.endsWith('/')
          ? process.env.NEXT_PUBLIC_SERVER_URL
          : `${process.env.NEXT_PUBLIC_SERVER_URL}/`;
  
        const response = await axios.get<LoanRequest>(`${serverURL}loan-requests/${loanId}/individual`);
        
        // Fetch transactions if available
        const transactionsResponse = await axios.get<Transaction[]>(`${serverURL}loan-requests/${loanId}/transactions`);
        
        setLoanRequest({ ...response.data, transactions: transactionsResponse.data });
        setEditableAmount(response.data.amountRequired);
      } catch (error) {
        console.error("Error fetching loan request details:", error);
      }
    };
  
    fetchLoanRequestDetails();
  }, [loanId]);
  

  const handleAmountChange = async () => {
    try {
      const serverURL = process.env.NEXT_PUBLIC_SERVER_URL?.endsWith('/')
        ? process.env.NEXT_PUBLIC_SERVER_URL
        : `${process.env.NEXT_PUBLIC_SERVER_URL}/`;

      await axios.put(`${serverURL}loan-requests/${loanId}`, { amountRequired: editableAmount });
      alert("Loan amount updated successfully");
      onClose(); // Optionally close the modal after saving
    } catch (error) {
      console.error("Error updating loan amount:", error);
    }
  };

  if (!loanRequest) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Loan Request Details</h2>
      <div className="bg-white p-4 rounded shadow-md">
        <div className="mb-2">
          <strong>Name:</strong> {loanRequest.member?.firstName ?? "N/A"} {loanRequest.member?.surname ?? "N/A"}
        </div>
        <div className="mb-2">
          <strong>Email:</strong> {loanRequest.member?.email ?? "N/A"}
        </div>
        <div className="mb-2">
          <strong>Total Savings:</strong> {loanRequest.member?.memberSavings.savingsBalance ?? "N/A"}
        </div>
        <div className="mb-2">
    <strong>Member Savings Balance:</strong> ₦{loanRequest.member?.memberSavings.savingsBalance?.toLocaleString('en-NG') || "0"}
  </div>
  <div className="mb-2">
    <strong>Total Deposits:</strong> ₦{loanRequest.member?.memberSavings.savingsDeposits?.toLocaleString('en-NG') || "0"}
  </div>
        <div className="mb-2">
          <strong>Loan Amount Requested:</strong>
          <input
            type="number"
            value={editableAmount}
            onChange={(e) => setEditableAmount(Number(e.target.value))}
            className="border p-1 ml-2"
          />
        </div>
        <button onClick={handleAmountChange} className="mt-4 bg-blue-500 text-white py-1 px-4 rounded">
          Update Loan Amount
        </button>
      </div>
    </div>
  );
};

export default LoanRequestDetail;
