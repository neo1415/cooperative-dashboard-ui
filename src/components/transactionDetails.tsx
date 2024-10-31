import { useState, useEffect } from 'react';
import axios from 'axios';

interface TransactionDetailProps {
  transactionId: string;
  onClose: () => void;
}

interface Transaction {
  id: string;
  dateOfEntry: string;
  savingsDeposits: number;
  withdrawals: number;
  savingsBalance: number;
  totalWithdrawals: number;
  grandTotal: number;
  member: {
    id: string;
    firstName: string;
    surname: string;
    email: string;
    memberDetails: {
      telephone1: string;
    };
  };
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({ transactionId, onClose }) => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
        const response = await axios.get<Transaction>(`${serverURL}/transactions/${transactionId}`);
        setTransaction(response.data);
      } catch (error) {
        console.error("Error fetching transaction details:", error);
      }
    };

    fetchTransactionDetails();
  }, [transactionId]);

  if (!transaction) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
      <div className="bg-white p-4 rounded shadow-md">
        <div className="mb-2">
          <strong>Date of Entry:</strong> {transaction.dateOfEntry}
        </div>
        <div className="mb-2">
          <strong>First Name:</strong> {transaction.member.firstName}
        </div>
        <div className="mb-2">
          <strong>Surname:</strong> {transaction.member.surname}
        </div>
        <div className="mb-2">
          <strong>Email:</strong> {transaction.member.email}
        </div>
        <div className="mb-2">
          <strong>Telephone:</strong> {transaction.member.memberDetails.telephone1}
        </div>
        <div className="mb-2">
          <strong>Savings Deposits:</strong> ₦{transaction.savingsDeposits.toLocaleString('en-NG')}
        </div>
        <div className="mb-2">
          <strong>Withdrawals:</strong> ₦{transaction.withdrawals.toLocaleString('en-NG')}
        </div>
        <div className="mb-2">
          <strong>Total Savings Balance:</strong> ₦{transaction.savingsBalance.toLocaleString('en-NG')}
        </div>
        <div className="mb-2">
          <strong>Total Withdrawals:</strong> ₦{transaction.totalWithdrawals.toLocaleString('en-NG')}
        </div>
        <div className="mb-2">
          <strong>Grand Total:</strong> ₦{transaction.grandTotal.toLocaleString('en-NG')}
        </div>
        <button onClick={onClose} className="mt-4 bg-blue-500 text-white py-1 px-4 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default TransactionDetail;
