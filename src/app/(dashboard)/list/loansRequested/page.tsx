"use client";

import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, CircularProgress, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import { CSVLink } from "react-csv";
import axios from "axios";
import { auth } from "@/app/api/config";


// Interface for LoanRequest
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

const LoanRequestsPage: React.FC = () => {
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [filteredLoanRequests, setFilteredLoanRequests] = useState<LoanRequest[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // Check if user is admin
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLoan, setSelectedLoan] = useState<LoanRequest | null>(null);
  const [status, setStatus] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  // Fetch loan requests on component mount
  useEffect(() => {
    const fetchLoanRequests = async () => {
      const user = auth.currentUser;

      if (user) {
        try {
          const token = await user.getIdToken();
          const cooperativeId = localStorage.getItem("cooperativeId"); // Optional
          const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

          const response = await axios.get(`${serverURL}/loan-requests`, {
            params: { cooperativeId }, // Query cooperativeId if it's available
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            const fetchedLoanRequests = response.data;
            setLoanRequests(fetchedLoanRequests);
            setFilteredLoanRequests(fetchedLoanRequests);

            // Check if user is admin from claims (Firebase)
            const idTokenResult = await user.getIdTokenResult();
            setIsAdmin(idTokenResult.claims.role === 'cooperative-admin');
            setIsAuthenticated(true);
          } else {
            throw new Error("Failed to fetch loan requests");
          }
        } catch (error) {
          console.error("Error fetching loan requests:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchLoanRequests();
  }, []);

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
    { label: "Loan ID", key: "id" },
    { label: "Cooperative Name", key: "cooperativeName" },
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
    <div>
      <TextField
        label="Search"
        variant="outlined"
        value={search}
        onChange={handleSearch}
        style={{ marginBottom: "20px" }}
      />
      <CSVLink data={filteredLoanRequests} headers={headers} filename="loan-requests.csv">
        <Button variant="contained" color="primary" style={{ marginBottom: "20px" }}>
          Export CSV
        </Button>
      </CSVLink>
      <TableContainer component={Paper}>
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
                <TableRow key={loanRequest.id}>
                  <TableCell>{loanRequest.id}</TableCell>
                  <TableCell>{loanRequest.cooperative.cooperativeName}</TableCell>
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
                  <TableCell>{loanRequest.dateOfApplication}</TableCell>
                  <TableCell>{loanRequest.expectedReimbursementDate}</TableCell>

                  {/* Status Button */}
                  <TableCell>
                    {isAdmin ? (
                      <Button
                      aria-hidden='false'
                        variant="contained"
                        color={loanRequest.approved ? "success" : loanRequest.rejected ? "error" : "warning"}
                        onClick={(e) => handleStatusClick(e, loanRequest)}
                      >
                        {loanRequest.approved
                          ? "Approved"
                          : loanRequest.rejected
                          ? "Rejected"
                          : "Pending"}
                      </Button>
                    ) : (
                      <span>{loanRequest.pending ? "Pending" : loanRequest.approved ? "Approved" : "Rejected"}</span>
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

      {/* Confirmation Modal */}
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
