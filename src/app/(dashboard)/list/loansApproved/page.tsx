"use client"

import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, Avatar,TableContainer, TableHead, TableRow, Paper, Button, TextField, CircularProgress
} from "@mui/material";
import { CSVLink } from "react-csv";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { LoanApprove } from "@/types/types";


const LoanApprovedPage: React.FC = () => {
  const [loanApproved, setLoanApproved] = useState<LoanApprove[]>([]);
  const [filteredLoanApproved, setFilteredLoanApproved] = useState<LoanApprove[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const getInitials = (firstName: string, surname: string) => {
    return `${firstName.charAt(0).toUpperCase()}${surname.charAt(0).toUpperCase()}`;
  };


  // Fetch loan requests on component mount
  useEffect(() => {
    const fetchLoanApproved = async () => {
      const auth = getAuth();
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
            const fetchedLoanApproved = response.data;
            setLoanApproved(fetchedLoanApproved);
            setFilteredLoanApproved(fetchedLoanApproved);
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

    fetchLoanApproved();
  }, []);

  // Handle search input and filter loan requests
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = loanApproved.filter((loanApprove) =>
      Object.values(loanApprove)
        .concat(Object.values(loanApprove.member))
        .some((val) => val?.toString().toLowerCase().includes(value))
    );
    setFilteredLoanApproved(filtered);
  };

  const headers = [
    { label: "", key: "member.img" },
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

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </div>
    );
  }

  // If no user is authenticated
  if (!isAuthenticated) {
    return <div>No user authenticated. Please log in.</div>;
  }

  // Render the loan requests table
  return (
    <div className="px-4 md:px-8 lg:px-12">
      <h1 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4">Approved Loans</h1>
      
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-4">
        <TextField
          label="Search"
          variant="outlined"
          value={search}
          onChange={handleSearch}
          className="w-full sm:w-auto"
        />
        <CSVLink
          data={filteredLoanApproved}
          headers={headers}
          filename="loan-requests.csv"
        >
          <Button variant="contained" color="primary">
            Export CSV
          </Button>
        </CSVLink>
      </div>
  
      <TableContainer component={Paper} className="w-full overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHead>
            <TableRow>
              {headers.map((column) => (
                <TableCell key={column.key} className="text-xs md:text-sm lg:text-base font-medium">
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLoanApproved.length > 0 ? (
              filteredLoanApproved.map((loanApprove) => (
                <TableRow key={loanApprove.id}>
                  <TableCell>
                    {loanApprove.member.memberDetails.img ? (
                      <Avatar
                        src={loanApprove.member.memberDetails.img}
                        alt="member-profile image"
                        sx={{ width: 32, height: 32, "@media (min-width: 768px)": { width: 40, height: 40 } }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: '#9c27b0',
                          color: '#fff',
                          "@media (min-width: 768px)": { width: 40, height: 40 },
                        }}
                      >
                        {getInitials(loanApprove.member.firstName, loanApprove.member.surname)}
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>{loanApprove.cooperative.cooperativeName}</TableCell>
                  <TableCell>{loanApprove.member.email}</TableCell>
                  <TableCell>{loanApprove.member.firstName}</TableCell>
                  <TableCell>{loanApprove.member.surname}</TableCell>
                  <TableCell>{loanApprove.amountRequired}</TableCell>
                  <TableCell>{loanApprove.purposeOfLoan}</TableCell>
                  <TableCell>{loanApprove.durationOfLoan}</TableCell>
                  <TableCell>{loanApprove.bvn}</TableCell>
                  <TableCell>{loanApprove.nameOfSurety1}</TableCell>
                  <TableCell>{loanApprove.surety1MembersNo}</TableCell>
                  <TableCell>{loanApprove.surety1telePhone}</TableCell>
                  <TableCell>{loanApprove.nameOfSurety2}</TableCell>
                  <TableCell>{loanApprove.surety2MembersNo}</TableCell>
                  <TableCell>{loanApprove.surety2telePhone}</TableCell>
                  <TableCell>{loanApprove.amountGranted}</TableCell>
                  <TableCell>{loanApprove.loanInterest}</TableCell>
                  <TableCell>{loanApprove.dateOfApplication}</TableCell>
                  <TableCell>{loanApprove.expectedReimbursementDate}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={headers.length} align="center" className="text-sm md:text-base">
                  No loan requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
  
};

export default LoanApprovedPage;
