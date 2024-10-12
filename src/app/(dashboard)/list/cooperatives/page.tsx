"use client";

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';
import { CSVLink } from 'react-csv';
import axios from 'axios';

// Define the CooperativeDetails interface
interface CooperativeDetails {
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
interface Cooperative {
  id: string;
  cooperativeName: string;
  createdAt: string;
  cooperativeDetails: CooperativeDetails[]; // CooperativeDetails is an array
}

const CooperativeListPage: React.FC = () => {
  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);
  const [filteredCooperatives, setFilteredCooperatives] = useState<Cooperative[]>([]);
  const [search, setSearch] = useState<string>('');

  // Fetch cooperatives from the backend API
  useEffect(() => {
    const fetchCooperatives = async () => {
      const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
      try {
        const response = await axios.get(`${serverURL}/get-cooperatives`);
        console.log('Fetched cooperatives:', response.data);
        setCooperatives(response.data);
        setFilteredCooperatives(response.data);
      } catch (error) {
        console.error('Error fetching cooperatives:', error);
      }
    };

    fetchCooperatives();
  }, []);

  // Handle search input and filter results
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = cooperatives.filter((cooperative) =>
      Object.values(cooperative).some((val) => val && val.toString().toLowerCase().includes(value))
    );
    setFilteredCooperatives(filtered);
  };

  // Define the CSV headers for export
  const headers = [
    { label: "Cooperative Name", key: "cooperativeName" },
    { label: "ID", key: "id" },
    { label: "Created At", key: "createdAt" },
    { label: "Registration Number", key: "registrationNumber" },
    { label: "Date of Incorporation", key: "dateOfIncorporation" },
    { label: "Address", key: "address" },
    { label: "Email", key: "email" },
    { label: "Phone Number", key: "phoneNumber" },
    { label: "Total Savings", key: "totalSavings" },
    { label: "Total Debt", key: "totalDebt" },
    { label: "Total Loans Requested", key: "totalLoansRequested" },
    { label: "Total Loans Approved", key: "totalLoansApproved" },
    { label: "Total Profit", key: "totalProfit" },
    { label: "Director Name", key: "directorName" },
    { label: "Director Position", key: "directorPosition" },
    { label: "Director Email", key: "directorEmail" },
    { label: "Director Phone Number", key: "directorPhoneNumber" },
    { label: "Director Date of Birth", key: "directorDateOfBirth" },
    { label: "Director Place of Birth", key: "directorPlaceOfBirth" },
    { label: "Director Nationality", key: "directorNationality" },
    { label: "Director Occupation", key: "directorOccupation" },
    { label: "Director BVN Number", key: "directorBVNNumber" },
    { label: "Director ID Type", key: "directorIDType" },
    { label: "Director ID Number", key: "directorIDNumber" },
    { label: "Director Issued Date", key: "directorIssuedDate" },
    { label: "Director Expiry Date", key: "directorExpiryDate" },
    { label: "Director Source of Income", key: "directorSourceOfIncome" },

  ];

  return (
    <div>
      <TextField
        label="Search"
        variant="outlined"
        value={search}
        onChange={handleSearch}
        style={{ marginBottom: '20px' }}
      />
      <CSVLink data={filteredCooperatives} headers={headers} filename="cooperatives.csv">
        <Button variant="contained" color="primary" style={{ marginBottom: '20px' }}>
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
            {Array.isArray(filteredCooperatives) && filteredCooperatives.length > 0 ? (
              filteredCooperatives.map((cooperative) => (
                <TableRow key={cooperative.id}>
                  {/* Cooperative fields */}
                  <TableCell>{cooperative.cooperativeName}</TableCell>
                  <TableCell>{cooperative.id}</TableCell>
                  <TableCell>{new Date(cooperative.createdAt).toLocaleDateString()}</TableCell>
                  
                  {/* CooperativeDetails fields */}
                  {Array.isArray(cooperative.cooperativeDetails) && cooperative.cooperativeDetails.length > 0 ? (
                    <>
                      <TableCell>{cooperative.cooperativeDetails[0].registrationNumber || 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].dateOfIncorporation
                        ? new Date(cooperative.cooperativeDetails[0].dateOfIncorporation).toLocaleDateString()
                        : 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].address || 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].email || 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].phoneNumber || 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].totalSavings || 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].totalDebt || 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].totalLoansRequested || 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].totalLoansApproved || 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].totalProfit || 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].directorName || 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].directorPosition || 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].directorEmail || 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].directorPhoneNumber || 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].directorDateOfBirth
                        ? new Date(cooperative.cooperativeDetails[0].directorDateOfBirth).toLocaleDateString()
                        : 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].directorPlaceOfBirth || 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].directorNationality || 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].directorOccupation || 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].directorBVNNumber || 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].directorIDType || 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].directorIDNumber || 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].directorIssuedDate || 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].directorExpiryDate || 'N/A'}</TableCell>
                      <TableCell>{cooperative.cooperativeDetails[0].directorSourceOfIncome || 'N/A'}</TableCell>
                    </>
                  ) : (
                    <TableCell colSpan={headers.length}>No Cooperative Details Available</TableCell>
                  )}
                </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={headers.length} align="center">No cooperatives found.</TableCell>
    </TableRow>
  )}
</TableBody>

        </Table>
      </TableContainer>
    </div>
  );
  
};

export default CooperativeListPage;
