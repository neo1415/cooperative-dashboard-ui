// src/app/(dashboard)/list/loansRequested/[id]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '@/app/api/config';
import { useAuth } from '@/context/AuthCOntext';
import {
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

interface LoanRequestDetailProps {
  loanId: string;
  onClose: () => void;
}

interface Transaction {
  id: string;
  savingsBalance: number;
  savingsDeposits: number;
  dateOfEntry: string;
}

interface LoanRequest {
  loanId: string;
  amountGranted: number;
  purposeOfLoan: string;
  durationOfLoan: number;
  dateOfApplication: string;
  expectedReimbursementDate: string;
  interestRate: number;
  grandTotal: number;
  lastSavings: number;
  savingsFrequency: number;
  pending?: boolean;
  approved?: boolean;
  rejected?: boolean;
  member?: {
    id: string;
    firstName: string;
    surname: string;
    email: string;
  };
  transactions?: Transaction[];
}

const LoanRequestDetail: React.FC<LoanRequestDetailProps> = ({ loanId, onClose }) => {
  const { role, cooperativeId, memberId } = useAuth();
  const [loanRequest, setLoanRequest] = useState<LoanRequest | null>(null);
  const [editableAmount, setEditableAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchLoanRequestDetails = async () => {
      if (!role || (role === 'cooperative-admin' && !cooperativeId) || (role === 'member' && !memberId)) {
        setLoading(false);
        return;
      }

      try {
        const token = await auth.currentUser?.getIdToken();
        const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

        const response = await axios.get<LoanRequest>(`${serverURL}/loan-requests/${loanId}/individual`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setLoanRequest(response.data);
          setEditableAmount(response.data.amountGranted);
        }
      } catch (error) {
        console.error('Error fetching loan request details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanRequestDetails();
  }, [loanId, role, cooperativeId, memberId]);

  const handleAmountChange = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

      await axios.put(`${serverURL}/updateLoanAmount/${loanId}`, { amountGranted: editableAmount }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Loan amount updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating loan amount:', error);
    }
  };

  const handleStatusClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleStatusSelect = (newStatus: string) => {
    setStatus(newStatus);
    setOpen(true);
    setAnchorEl(null);
  };

  const handleConfirmStatusChange = async () => {
    const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
    const token = await auth.currentUser?.getIdToken();

    try {
      const response = await axios.post(
        `${serverURL}/loan-request/status`,
        { loanId, newStatus: status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        alert(`Loan status changed to "${status}" successfully`);
        setLoanRequest((prev) =>
          prev ? { ...prev, pending: status === 'pending', approved: status === 'approved', rejected: status === 'rejected' } : null
        );
      }
    } catch (error) {
      console.error('Error updating loan status:', error);
      alert('Failed to update loan status. Please try again.');
    } finally {
      setOpen(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!loanRequest) return <p>Loan request not found or failed to load.</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Loan Request Details</h2>
      <div className="bg-white p-4 rounded shadow-md">
        <div className="mb-2">
          <strong>Name:</strong> {loanRequest.member?.firstName ?? 'N/A'} {loanRequest.member?.surname ?? 'N/A'}
        </div>
        <div className="mb-2">
          <strong>Email:</strong> {loanRequest.member?.email ?? 'N/A'}
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
        <div className="mb-2">
          <strong>Purpose of Loan:</strong> {loanRequest.purposeOfLoan}
        </div>
        <div className="mb-2">
          <strong>Interest Rate:</strong> {loanRequest.interestRate}%
        </div>
        <div className="mb-2">
          <strong>Expected Reimbursement Date:</strong> {new Date(loanRequest.expectedReimbursementDate).toLocaleDateString()}
        </div>

        <h3 className="text-lg font-bold mt-4 mb-2">Savings Details</h3>
        <div className="mb-2">
          <strong>Grand Total Savings:</strong> {loanRequest.grandTotal}
        </div>
        <div className="mb-2">
          <strong>Last Savings Balance:</strong> {loanRequest.lastSavings}
        </div>
        <div className="mb-2">
          <strong>Savings Frequency:</strong> {loanRequest.savingsFrequency} deposits
        </div>

        <button onClick={handleStatusClick} className="mt-4 bg-green-500 text-white py-1 px-4 rounded">
          Change Loan Status
        </button>

        <button onClick={handleAmountChange} className="mt-4 bg-blue-500 text-white py-1 px-4 rounded">
          Update Loan Amount
        </button>
      </div>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => handleStatusSelect('pending')}>Pending</MenuItem>
        <MenuItem onClick={() => handleStatusSelect('approved')}>Approved</MenuItem>
        <MenuItem onClick={() => handleStatusSelect('rejected')}>Rejected</MenuItem>
      </Menu>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>Are you sure you want to set the status to `{status}`?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmStatusChange} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LoanRequestDetail;
