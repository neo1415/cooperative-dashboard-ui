"use client"

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';
import { CSVLink } from 'react-csv';
import axios from 'axios';
import { auth } from '@/app/api/config';

interface Member {
  id: string;
  surname: string;
  firstName: string;
  middleName?: string;
  telephone1: string;
  telephone2?: string;
  email: string;
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

const MembersListPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const fetchMembers = async () => {
      const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
      
      // Listen to Firebase auth state
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const token = await user.getIdToken();  // Get Firebase ID token from the current user
  
            const response = await fetch(`${serverURL}/members`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,  // Send token in Authorization header
                'Content-Type': 'application/json',
              },
            });
            
            if (!response.ok) {
              throw new Error('Failed to fetch members');
            }
  
            const fetchedMembers = await response.json();
            console.log('Members:', fetchedMembers);  // Log members for debugging
  
            // Set the members state
            setMembers(fetchedMembers);
            setFilteredMembers(fetchedMembers); // Initialize the filtered list with all members
          } catch (error) {
            console.error('Error fetching members:', error);
          }
        } else {
          console.log('No user logged in');
        }
      });
  
      return () => unsubscribe(); // Cleanup the listener on unmount
    };
  
    fetchMembers();
  }, []);
  
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = members.filter((member) =>
      Object.values(member).some((val) => val && val.toString().toLowerCase().includes(value))
    );
    setFilteredMembers(filtered);
  };

  const headers = [
    { label: "Surname", key: "surname" },
    { label: "First Name", key: "firstName" },
    { label: "Middle Name", key: "middleName" },
    { label: "Telephone 1", key: "telephone1" },
    { label: "Telephone 2", key: "telephone2" },
    { label: "Email", key: "email" },
    { label: "Sex", key: "sex" },
    { label: "Marital Status", key: "maritalStatus" },
    { label: "Occupation", key: "occupation" },
    { label: "Business", key: "business" },
    { label: "Residential Address", key: "residentialAddress" },
    { label: "LGA", key: "lga" },
    { label: "State", key: "state" },
    { label: "Permanent Home Address", key: "permanentHomeAddress" },
    { label: "State of Origin", key: "stateOfOrigin" },
    { label: "LGA 2", key: "lga2" },
    { label: "Amount Paid", key: "amountPaid" },
    { label: "Next of Kin Name", key: "nextOfKinName" },
    { label: "Next of Kin Phone 1", key: "nextOfKinPhone" },
    { label: "Next of Kin Phone 2", key: "nextOfKinPhone2" },
    { label: "Sponsor", key: "sponsor" },
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
      <CSVLink data={filteredMembers} headers={headers} filename="members.csv">
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
  {Array.isArray(filteredMembers) && filteredMembers.length > 0 ? (
    filteredMembers.map((member) => (
      <TableRow key={member.id}>
        <TableCell>{member.surname}</TableCell>
        <TableCell>{member.firstName}</TableCell>
        <TableCell>{member.middleName || 'N/A'}</TableCell>
        <TableCell>{member.telephone1}</TableCell>
        <TableCell>{member.telephone2 || 'N/A'}</TableCell>
        <TableCell>{member.email}</TableCell>
        <TableCell>{member.sex}</TableCell>
        <TableCell>{member.maritalStatus}</TableCell>
        <TableCell>{member.occupation}</TableCell>
        <TableCell>{member.business}</TableCell>
        <TableCell>{member.residentialAddress}</TableCell>
        <TableCell>{member.lga}</TableCell>
        <TableCell>{member.state}</TableCell>
        <TableCell>{member.permanentHomeAddress}</TableCell>
        <TableCell>{member.stateOfOrigin}</TableCell>
        <TableCell>{member.lga2}</TableCell>
        <TableCell>{member.amountPaid}</TableCell>
        <TableCell>{member.nextOfKinName}</TableCell>
        <TableCell>{member.nextOfKinPhone}</TableCell>
        <TableCell>{member.nextOfKinPhone2}</TableCell>
        <TableCell>{member.sponsor}</TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={21} align="center">
        No members found.
      </TableCell>
    </TableRow>
  )}
</TableBody>

        </Table>
      </TableContainer>
    </div>
  );
};

export default MembersListPage;
