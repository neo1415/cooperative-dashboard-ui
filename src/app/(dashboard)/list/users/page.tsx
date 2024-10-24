"use client";

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, CircularProgress } from '@mui/material';
import { CSVLink } from 'react-csv';
import axios from 'axios';
import { auth } from '@/app/api/config'; // Ensure auth config is correct
import { browserSessionPersistence, setPersistence } from 'firebase/auth';

// Member interface
interface Member {
  id: string;
  surname: string;
  firstName: string;
  email: string;
  memberDetails?: MemberDetails; // Optional memberDetails array
}

// MemberDetails interface
interface MemberDetails {
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

const MembersListPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // To track if user is authenticated

  setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // Existing and future Auth states will be persisted
  })
  .catch((error) => {
    console.error("Persistence error: ", error);
  });
  // Fetch members on component mount
  useEffect(() => {
    const fetchMembers = async () => {
      const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
      
      // Listen to Firebase auth state
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const token = await user.getIdToken();  // Get Firebase ID token from the current user
  
            const response = await axios.get(`${serverURL}/members`, {
              headers: {
                Authorization: `Bearer ${token}`,  // Send token in Authorization header
                'Content-Type': 'application/json',
              },
            });
  
            if (response.status === 200) {
              const fetchedMembers = response.data;
              console.log('Members:', fetchedMembers);  // Log members for debugging
  
              // Set the members state
              setMembers(fetchedMembers);
              setFilteredMembers(fetchedMembers); // Initialize the filtered list with all members
              setIsAuthenticated(true); // Set the user as authenticated
            } else {
              throw new Error('Failed to fetch members');
            }
          } catch (error) {
            console.error('Error fetching members:', error);
          } finally {
            setLoading(false); // Set loading to false whether success or error
          }
        } else {
          console.log('No user logged in');
          setLoading(false); // Stop loading if no user is logged in
        }
      });
  
      return () => unsubscribe(); // Cleanup the listener on unmount
    };
  
    fetchMembers();
  }, []);
  
  // Handle search input and filter members based on input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = members.filter((member) =>
      Object.values(member).some((val) => val && val.toString().toLowerCase().includes(value))
    );
    setFilteredMembers(filtered);
  };

  // CSV headers for export
  const headers = [
    { label: "Email", key: "email" },
    { label: "Surname", key: "surname" },
    { label: "First Name", key: "firstName" },
    { label: "Middle Name", key: "middleName" },
    { label: "Telephone 1", key: "telephone1" },
    { label: "Telephone 2", key: "telephone2" },
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

  // Render loading indicator if still fetching data
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  // Render content only if user is authenticated
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
        {/* Basic Member fields */}
        <TableCell>{member.email}</TableCell>
        <TableCell>{member.surname}</TableCell>
        <TableCell>{member.firstName}</TableCell>

        {/* MemberDetails fields */}
        {member.memberDetails ? (
          <>
            <TableCell>{member.memberDetails.middleName || 'N/A'}</TableCell>
            <TableCell>{member.memberDetails.telephone1 || 'N/A'}</TableCell>
            <TableCell>{member.memberDetails.telephone2 || 'N/A'}</TableCell>
            <TableCell>{member.memberDetails.sex || 'N/A'}</TableCell>
            <TableCell>{member.memberDetails.maritalStatus || 'N/A'}</TableCell>
            <TableCell>{member.memberDetails.occupation || 'N/A'}</TableCell>
            <TableCell>{member.memberDetails.business || 'N/A'}</TableCell>
            <TableCell>{member.memberDetails.residentialAddress || 'N/A'}</TableCell>
            <TableCell>{member.memberDetails.lga || 'N/A'}</TableCell>
            <TableCell>{member.memberDetails.state || 'N/A'}</TableCell>
            <TableCell>{member.memberDetails.permanentHomeAddress || 'N/A'}</TableCell>
            <TableCell>{member.memberDetails.stateOfOrigin || 'N/A'}</TableCell>
            <TableCell>{member.memberDetails.lga2 || 'N/A'}</TableCell>
            <TableCell>{member.memberDetails.amountPaid || 'N/A'}</TableCell>
            <TableCell>{member.memberDetails.nextOfKinName || 'N/A'}</TableCell>
            <TableCell>{member.memberDetails.nextOfKinPhone || 'N/A'}</TableCell>
            <TableCell>{member.memberDetails.nextOfKinPhone2 || 'N/A'}</TableCell>
            <TableCell>{member.memberDetails.sponsor || 'N/A'}</TableCell>
          </>
        ) : (
          <TableCell colSpan={headers.length}>No additional details</TableCell>
        )}
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={headers.length} align="center">
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
