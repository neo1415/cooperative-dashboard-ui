"use client";

import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem,
  Select, Button, CircularProgress, InputLabel, FormControl
} from '@mui/material';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import dayjs from 'dayjs';
import { auth } from '@/app/api/config';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthCOntext';


// Define the interface for transaction data
export interface Transaction {
  id?: string;
  img?: string;
  firstName?: string;
  surname?: string;
  email?: string;
  dateOfEntry: string;
  telephone?: string;
  type: 'savings' | 'loans';  // Ensure type property is included in each transaction
  savingsDeposits: number;
  withdrawals: number;
  savingsBalance: number;
  totalWithdrawals: number;
  grandTotal: number;
}

// Component
const TransactionsTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState<string>('');
  const [month, setMonth] = useState<string | undefined>();
  const [year, setYear] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<'savings' | 'loans' | ''>('');  // Filter by type

  const months = Array.from({ length: 12 }, (_, i) => dayjs().month(i).format('MMMM'));
  const years = Array.from(new Set(transactions.map((t) => dayjs(t.dateOfEntry).year().toString())));

const router = useRouter()

  const handleViewMoreClick = (memberId: string) => {
    router.push(`/member-savings/${memberId}`); // Navigate to the specific member's page
  };
  const { role } = useAuth();
  const isAuthenticated = role !== null;
  const isAdmin = role === "cooperative-admin";
  // Fetch transactions data on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
      
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const token = await user.getIdToken();
            const response = await axios.get(`${serverURL}/transactions`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (response.status === 200) {
              setTransactions(response.data);
              setFilteredTransactions(response.data);
            } else {
              throw new Error('Failed to fetch transactions');
            }
          } catch (error) {
            console.error('Failed to fetch transactions:', error);
          } finally {
            setLoading(false);
          }
        } else {
          console.warn('No authenticated user found.');
          setLoading(false);
        }
      });

      return () => unsubscribe();
    };

    fetchTransactions();
  }, []);

  // Filter transactions based on search, type, month, and year
  useEffect(() => {
    let tempTransactions = transactions;

    // Filter by search term
    if (search) {
      tempTransactions = tempTransactions.filter(
        (t) =>
          (t.firstName?.toLowerCase().includes(search.toLowerCase()) ||
           t.surname?.toLowerCase().includes(search.toLowerCase()) ||
           t.email?.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Filter by transaction type
    if (filterType) {
      tempTransactions = tempTransactions.filter((t) => t.type === filterType);
    }

    // Filter by month and year
    if (month) {
      tempTransactions = tempTransactions.filter(
        (t) => dayjs(t.dateOfEntry).format('MMMM') === month
      );
    }
    if (year) {
      tempTransactions = tempTransactions.filter(
        (t) => dayjs(t.dateOfEntry).year().toString() === year
      );
    }

    setFilteredTransactions(tempTransactions);
  }, [search, filterType, month, year, transactions]);

  if (loading) return <CircularProgress />;

  return (
    <div>
      {/* Filters */}
      <div 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '16px', 
          marginBottom: '20px', 
          alignItems: 'center' 
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email"
          style={{ flex: '1 1 150px', minWidth: '150px' }}
        />
        <FormControl style={{ flex: '1 1 120px', minWidth: '120px' }}>
          <InputLabel>Month</InputLabel>
          <Select 
            value={month || ''} 
            onChange={(e) => setMonth(e.target.value || undefined)}
          >
            <MenuItem value="">All</MenuItem>
            {months.map((m) => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl style={{ flex: '1 1 120px', minWidth: '120px' }}>
          <InputLabel>Year</InputLabel>
          <Select 
            value={year || ''} 
            onChange={(e) => setYear(e.target.value || undefined)}
          >
            <MenuItem value="">All</MenuItem>
            {years.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          size="small"
          color={filterType === 'savings' ? 'primary' : 'inherit'}
          onClick={() => setFilterType('savings')}
        >
          Savings
        </Button>
        <Button
          variant="outlined"
          size="small"
          color={filterType === 'loans' ? 'primary' : 'inherit'}
          onClick={() => setFilterType('loans')}
        >
          Loans
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setFilterType('')}
        >
          All
        </Button>
        <Button 
          variant="outlined" 
          size="small" 
          style={{ height: 40, flexShrink: 0 }}
        >
          <CSVLink 
            data={filteredTransactions} 
            filename="transactions.csv" 
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            Export to CSV
          </CSVLink>
        </Button>
      </div>
  
      {/* Transactions Table */}
      <TableContainer 
        component={Paper} 
        style={{ overflowX: 'auto' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telephone</TableCell>
              <TableCell>Savings Deposits</TableCell>
              <TableCell>Withdrawals</TableCell>
              <TableCell>Total Savings</TableCell>
              <TableCell>Total Withdrawals</TableCell>
              <TableCell>Grand Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id} style={{ backgroundColor: transaction.type === 'savings' ? 'lightSkyBlue' : 'lightGoldenRodYellow' }}
              >
                <TableCell>{dayjs(transaction.dateOfEntry).format('DD MMM YYYY')}</TableCell>
                <TableCell>{transaction.firstName}</TableCell>
                <TableCell>{transaction.surname}</TableCell>
                <TableCell>{transaction.email}</TableCell>
                <TableCell>{transaction.telephone}</TableCell>
                <TableCell>{transaction.savingsDeposits}</TableCell>
                <TableCell>{transaction.withdrawals}</TableCell>
                <TableCell>{transaction.grandTotal}</TableCell>
                <TableCell>{transaction.totalWithdrawals}</TableCell>
                <TableCell>{transaction.savingsBalance}</TableCell>
                {role === 'cooperative-admin' && (
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewMoreClick(transaction.id)}
                    >
                      View More
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
  
};

export default TransactionsTable;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TextField,
//   TablePagination,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Avatar,
//   CircularProgress,
// } from "@mui/material";
// import { auth } from "@/app/api/config";

// interface Record {
//   date: string;
//   savings?: number;
//   contributions?: number;
//   loans?: number;
//   assetLoans?: number;
//   cumulativeSavings: number;
//   cumulativeContributions: number;
//   cumulativeLoans: number;
//   cumulativeAssetLoans: number;
//   grandTotal: number;
//   firstName: string;
//   surname: string;
//   email: string;
//   img?: string;
//   telephone1: string;
//   residentialAddress: string;
//   nextOfKinName: string;
//   nextOfKinPhone: string;
//   bvn: string;
// }

// const TransactionsTable: React.FC = () => {
//   const [records, setRecords] = useState<Record[]>([]);
//   const [filter, setFilter] = useState("");
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const fetchRecords = async () => {
//     try {
//       setLoading(true);
//       const user = auth.currentUser;

//       if (!user) {
//         throw new Error("User not authenticated. Please log in again.");
//       }

//       const token = await user.getIdToken();
//       const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
//       const response = await axios.get<{ stats: Record[] }>(
//         `${serverURL}/member/savings/stats`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const apiRecords = response.data.stats || [];
//       let cumulativeSavings = 0;
//       let cumulativeContributions = 0;
//       let cumulativeLoans = 0;


//       const enrichedRecords = apiRecords.map((record) => {
//         const savings = record.savings || 0;
//         const contributions = record.contributions || 0;
//         const loans = record.loans || 0;
//         const assetLoans = record.assetLoans || 0;

//         cumulativeSavings += savings;
//         cumulativeContributions += contributions;
//         cumulativeLoans += loans;
    

//         return {
//           ...record,
//           cumulativeSavings,
//           cumulativeContributions,
//           cumulativeLoans,
    
//           grandTotal: record.grandTotal, 
//           img: record.img || "", // Default image if none provided
//         };
//       });

//       setRecords(enrichedRecords);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred while fetching data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRecords();
//   }, []);

//   const filteredRecords = records.filter((record) => {
//     const matchesSearch = search
//       ? Object.values(record).some((value) =>
//           String(value).toLowerCase().includes(search.toLowerCase())
//         )
//       : true;

//     const matchesFilter = filter ? record.date.startsWith(filter) : true;

//     return matchesSearch && matchesFilter;
//   });

//   const paginatedRecords = filteredRecords.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   const uniqueMonths = Array.from(
//     new Set(records.map((record) => record.date.slice(0, 7)))
//   );

//   const handlePageChange = (event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   return (
//     <>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {loading && <p>Loading records...</p>}

//       <FormControl variant="outlined" fullWidth style={{ marginBottom: 20 }}>
//         <InputLabel>Filter by Month/Year</InputLabel>
//         <Select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           label="Filter by Month/Year"
//         >
//           {uniqueMonths.map((month) => (
//             <MenuItem key={month} value={month}>
//               {month}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       <TextField
//         fullWidth
//         label="Search by Value"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         style={{ margin: "20px 0" }}
//       />

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Date</TableCell>
//               <TableCell>Image</TableCell>
//               <TableCell>Surname</TableCell>
//               <TableCell>First Name</TableCell>
//               <TableCell>Phone Number</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>House Address</TableCell>
//               <TableCell>Next of Kin Name</TableCell>
//               <TableCell>Next of Kin Number</TableCell>
//               <TableCell>Bvn</TableCell>
//               <TableCell>Contributions</TableCell>
//               <TableCell>Loans</TableCell>
//               <TableCell>Asset Loans</TableCell>
//               <TableCell>Cumulative Savings</TableCell>
//               <TableCell>Cumulative Contributions</TableCell>
//               <TableCell>Cumulative Loans</TableCell>
//               <TableCell>Cumulative Asset Loans</TableCell>
//               <TableCell>Grand Total</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {paginatedRecords.map((record, index) => (
//               <TableRow key={index}>
//                 <TableCell>{record.date}</TableCell>
//                 <TableCell>
//                   {record.img ? (
//                     <Avatar src={record.img} alt="Member Profile" sx={{ width: 40, height: 40 }} />
//                   ) : (
//                     <Avatar
//                       sx={{
//                         width: 40,
//                         height: 40,
//                         bgcolor: "#9c27b0",
//                         color: "#fff",
//                       }}
//                     />
//                   )}
//                 </TableCell>
//                 <TableCell>{record.surname}</TableCell>
//                 <TableCell>{record.firstName}</TableCell>
//                 <TableCell>{record.telephone1}</TableCell>
//                 <TableCell>{record.email}</TableCell>
//                 <TableCell>{record.residentialAddress}</TableCell>
//                 <TableCell>{record.nextOfKinName}</TableCell>
//                 <TableCell>{record.nextOfKinPhone}</TableCell>
//                 <TableCell>{record.bvn}</TableCell>
//                 <TableCell>{record.contributions}</TableCell>
//                 <TableCell>{record.loans}</TableCell>
//                 <TableCell>{record.assetLoans}</TableCell>
//                 <TableCell>{record.cumulativeSavings}</TableCell>
//                 <TableCell>{record.cumulativeContributions}</TableCell>
//                 <TableCell>{record.cumulativeLoans}</TableCell>
//                 <TableCell>{record.cumulativeAssetLoans}</TableCell>
//                 <TableCell>{record.grandTotal}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <TablePagination
//         component="div"
//         count={filteredRecords.length}
//         page={page}
//         onPageChange={handlePageChange}
//         rowsPerPage={rowsPerPage}
//         onRowsPerPageChange={handleRowsPerPageChange}
//       />
//     </>
//   );
// };

// export default TransactionsTable;
