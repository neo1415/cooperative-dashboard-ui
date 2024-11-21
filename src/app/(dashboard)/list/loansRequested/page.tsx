"use client";

import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, CircularProgress, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle,  Avatar,
} from "@mui/material";
import { CSVLink } from "react-csv";
import axios from "axios";
import { auth } from "@/app/api/config";
import { useRouter } from "next/navigation";
import LoanRequestDetail from "./[id]/LoanRequestDetail";
import { useAuth } from "@/context/AuthCOntext";
import Image from "next/image";
import LoanFormModal from "@/components/forms/LoanForm";
import { useSavingsStats } from "@/hooks/useSavingsSrat";

interface LoanRequest {
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
  expectedAmountToBePaidBack?: number,
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
    memberSavings:{
      savingsBalance: number,
      savingsDeposits: number
    }
    memberDetails:{
      img:string;
    }
  };
  cooperative: {
    id: string;
    cooperativeName: string;
  };
}
interface LoanStats {
  totalLoans: number;
  approvedLoans: number;
  rejectedLoans: number;
  pendingLoans: number;
  totalRequestedAmount: number;
  totalGrantedAmount: number;
}

const LoanRequestsPage: React.FC = () => {
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [filteredLoanRequests, setFilteredLoanRequests] = useState<LoanRequest[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [, setLoanStats] = useState<LoanStats | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLoan, setSelectedLoan] = useState<LoanRequest | null>(null);
  const [status, setStatus] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const { loanStats, error } = useSavingsStats();
  const router = useRouter()


  const handleOpenModal = (loanId: string) => {
    setSelectedLoanId(loanId);
  };

  const handleCloseModal = () => {
    setSelectedLoanId(null);
  };
  const getInitials = (firstName: string, surname: string) => {
    return `${firstName.charAt(0).toUpperCase()}${surname.charAt(0).toUpperCase()}`;
  };


  const { role, cooperativeId, memberId } = useAuth();
  const isAuthenticated = role !== null;
  const isAdmin = role === "cooperative-admin";

  useEffect(() => {
    console.log("Role:", role, "Cooperative ID:", cooperativeId, "Member ID:", memberId);
  }, [role, cooperativeId, memberId]);

  useEffect(() => {
    const fetchLoanRequests = async () => {
      if (!auth.currentUser || !role || (role === 'cooperative-admin' && !cooperativeId) || (role === 'member' && !memberId)) {
        setLoading(false);
        return;
      }
  
      try {
        const token = await auth.currentUser.getIdToken();
        const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
  
        const response = await axios.get(`${serverURL}/loan-requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.status === 200) {
          setLoanRequests(response.data);
          setFilteredLoanRequests(response.data);
        } else {
          throw new Error("Failed to fetch loan requests");
        }
      } catch (error) {
        console.error("Error fetching loan requests:", error);
      } finally {
        setLoading(false);
      }
    };
  
    if (role && (role === 'cooperative-admin' ? cooperativeId : memberId)) {
      fetchLoanRequests();
    }
  }, [role, cooperativeId, memberId]);

  // useEffect(() => {
  //   const fetchLoanStats = async () => {
  //     try {
  //       const token = await auth.currentUser?.getIdToken();
  //       console.log('Fetched token:', token);
  
  //       const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
  //       console.log('Server URL:', serverURL);
  
  //       const response = await axios.get(`${serverURL}/loan-stats`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  
  //       if (response.status === 200) {
  //         console.log('Loan Stats response:', response.data);
  //         setLoanStats(response.data);
  //       } else {
  //         console.warn('Failed to fetch loan statistics, response status:', response.status);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching loan statistics:', error);
  //     }
  //   };
  
  //   fetchLoanStats();
  // }, [role, cooperativeId, memberId]);
  
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = loanRequests.filter((loanRequest) =>
      Object.values(loanRequest)
        .concat(Object.values(loanRequest.member))
        .some((val) => val?.toString().toLowerCase().includes(value))
    );
    setFilteredLoanRequests(filtered);
  };

  // Handle status button click (admin only)
  const handleStatusClick = (event: React.MouseEvent<HTMLElement>, loan: LoanRequest) => {
    if (isAdmin) {
      setAnchorEl(event.currentTarget);
      setSelectedLoan(loan);
    }
  };

  // Handle dropdown select
  const handleStatusSelect = (newStatus: string) => {
    setStatus(newStatus);
    setOpen(true);
    setAnchorEl(null); // Close dropdown
  };

  // Confirm status change
  const handleConfirmStatusChange = async () => {
    const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
    const token = localStorage.getItem("firebaseToken");

    try {
      const response = await axios.post(
        `${serverURL}/loan-request/status`,
        { loanId: selectedLoan?.id, newStatus: status }, // Send status update
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        // Update local loanRequests state with new status
        setLoanRequests((prev) =>
          prev.map((loan) =>
            loan.id === selectedLoan?.id ? { ...loan, pending: status === "pending", approved: status === "approved", rejected: status === "rejected" } : loan
          )
        );
      }
    } catch (error) {
      console.error("Error updating loan status:", error);
    } finally {
      setOpen(false);
    }
  };

  const headers = [
    // { label: "Loan ID", key: "id" },
    { label: "", key: "member.img" },
    { label: "Email", key: "member.email" },
    { label: "First Name", key: "member.firstName" },
    { label: "Surname", key: "member.surname" },
    { label: "Amount Requested", key: "amountRequired" },
    { label: "Purpose of Loan", key: "purposeOfLoan" },
    { label: "Duration (Months)", key: "durationOfLoan" },
    { label: "BVN", key: "bvn" },
    { label: "Surety 1 Name", key: "nameOfSurety1" },
    { label: "Surety 1 Member Number", key: "surety1MembersNo" },
    { label: "Surety 1 Phone", key: "surety1telePhone" },
    { label: "Surety 2 Name", key: "nameOfSurety2" },
    { label: "Surety 2 Member Number", key: "surety2MembersNo" },
    { label: "Surety 2 Phone", key: "surety2telePhone" },
    { label: "Amount Granted", key: "amountGranted" },
    { label: "Loan Interest", key: "loanInterest" },
    { label: "AmountTo Be Paid Back", key:"expectedAmountToBePaidBack"},
    { label: "Date of Application", key: "dateOfApplication" },
    { label: "Expected Reimbursement Date", key: "expectedReimbursementDate" },
    { label: "Status", key: "pending" }, // Approved, Rejected, or Pending
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <div>No user authenticated. Please log in.</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold mb-4">Requested Loans</h1>
  
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-6">
        <TextField
          label="Search"
          variant="outlined"
          value={search}
          onChange={handleSearch}
          className="w-full md:w-1/2 lg:w-1/3"
        />
        <CSVLink data={filteredLoanRequests} headers={headers} filename="loan-requests.csv">
          <Button variant="contained" color="primary">
            Export CSV
          </Button>
        </CSVLink>
      </div>
  
      <div className="mb-6">
        <LoanFormModal />
      </div>
  
      <div className="flex flex-wrap gap-4">
        {/* CARD */}
         {/* Total Loans Requested Card */}
         <div className="bg-white p-4 rounded-md shadow-sm flex-1 sm:w-[48%] md:w-[23%]">
        <h1 className="text-xl font-semibold">{loanStats?.totalLoans ?? 0}</h1>
        <span className="text-sm text-gray-400">Total Loans Requested</span>
      </div>

      {/* Approved Loans Card */}
      <div className="bg-white p-4 rounded-md shadow-sm flex-1 sm:w-[48%] md:w-[23%]">
        <h1 className="text-xl font-semibold">{loanStats?.approvedLoans ?? 0}</h1>
        <span className="text-sm text-gray-400">Total Approved Loans</span>
      </div>

      {/* Total Requested Amount Card */}
      <div className="bg-white p-4 rounded-md shadow-sm flex-1 sm:w-[48%] md:w-[23%]">
        <h1 className="text-xl font-semibold">
          ₦{loanStats?.totalRequestedAmount ?? 0}
        </h1>
        <span className="text-sm text-gray-400">Total Amount Requested</span>
      </div>

      {/* Total Granted Amount Card */}
      <div className="bg-white p-4 rounded-md shadow-sm flex-1 sm:w-[48%] md:w-[23%]">
        <h1 className="text-xl font-semibold">
          ₦{loanStats?.totalGrantedAmount ?? 0}
        </h1>
        <span className="text-sm text-gray-400">Total Amount Granted</span>
      </div>
      </div>
  
      <TableContainer component={Paper} className="mt-8 overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((column) => (
                <TableCell key={column.key}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLoanRequests.length > 0 ? (
              filteredLoanRequests.map((loanRequest) => (
                <TableRow
                  key={loanRequest.id}
                  className="bg-opacity-70"
                  style={{
                    backgroundColor: loanRequest.approved
                      ? "lightgreen"
                      : loanRequest.rejected
                      ? "lightcoral"
                      : "lightgoldenrodyellow",
                  }}
                >
                  <TableCell>
                    {loanRequest.member.memberDetails.img ? (
                      <Avatar
                        src={loanRequest.member.memberDetails.img}
                        alt="member-profile image"
                        sx={{ width: 40, height: 40 }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: "#9c27b0",
                          color: "#fff",
                        }}
                      >
                        {getInitials(
                          loanRequest.member.firstName,
                          loanRequest.member.surname
                        )}
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>{loanRequest.member.email}</TableCell>
                  <TableCell>{loanRequest.member.firstName}</TableCell>
                  <TableCell>{loanRequest.member.surname}</TableCell>
                  <TableCell>{loanRequest.amountRequired}</TableCell>
                  <TableCell>{loanRequest.purposeOfLoan}</TableCell>
                  <TableCell>{loanRequest.durationOfLoan}</TableCell>
                  <TableCell>{loanRequest.bvn}</TableCell>
                  <TableCell>{loanRequest.nameOfSurety1}</TableCell>
                  <TableCell>{loanRequest.surety1MembersNo}</TableCell>
                  <TableCell>{loanRequest.surety1telePhone}</TableCell>
                  <TableCell>{loanRequest.nameOfSurety2}</TableCell>
                  <TableCell>{loanRequest.surety2MembersNo}</TableCell>
                  <TableCell>{loanRequest.surety2telePhone}</TableCell>
                  <TableCell>{loanRequest.amountGranted}</TableCell>
                  <TableCell>{loanRequest.loanInterest}</TableCell>
                  <TableCell>{loanRequest.expectedAmountToBePaidBack}</TableCell>
                  <TableCell>{loanRequest.dateOfApplication}</TableCell>
                  <TableCell>{loanRequest.expectedReimbursementDate}</TableCell>
  
                  {/* Status Button */}
                  <TableCell>
                    {isAdmin ? (
                      <Button
                        variant="contained"
                        color={
                          loanRequest.approved
                            ? "success"
                            : loanRequest.rejected
                            ? "error"
                            : "warning"
                        }
                        onClick={(e) => handleStatusClick(e, loanRequest)}
                      >
                        {loanRequest.approved
                          ? "Approved"
                          : loanRequest.rejected
                          ? "Rejected"
                          : "Pending"}
                      </Button>
                    ) : (
                      <span>
                        {loanRequest.pending
                          ? "Pending"
                          : loanRequest.approved
                          ? "Approved"
                          : "Rejected"}
                      </span>
                    )}
                    {isAdmin && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenModal(loanRequest.id)}
                      >
                        Review
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={headers.length} align="center">
                  No loan requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
  
      {/* Dropdown Menu for Status Change */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleStatusSelect("pending")}>Pending</MenuItem>
        <MenuItem onClick={() => handleStatusSelect("approved")}>Approved</MenuItem>
        <MenuItem onClick={() => handleStatusSelect("rejected")}>Rejected</MenuItem>
      </Menu>
  
      <Dialog open={!!selectedLoanId} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogContent>
          {selectedLoanId && <LoanRequestDetail loanId={selectedLoanId} onClose={handleCloseModal} />}
        </DialogContent>
      </Dialog>
  
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          Are you sure you want to set the status to `{status}`?
        </DialogContent>
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

export default LoanRequestsPage;
