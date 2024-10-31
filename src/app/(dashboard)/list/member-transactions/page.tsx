"use client"

import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem,
  Select, Button, CircularProgress, InputLabel, FormControl
} from '@mui/material';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import dayjs from 'dayjs';
import { auth } from '@/app/api/config';

// Define the interface for transaction data
export interface Transaction {
    id: string;
    firstName?: string;
    surname?: string;
    email?: string;
    dateOfEntry: string;
    telephone?: string;
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

const months = Array.from({ length: 12 }, (_, i) => dayjs().month(i).format('MMMM'));
const years = Array.from(new Set(transactions.map((t) => dayjs(t.dateOfEntry).year().toString())));

  // Fetch transactions data on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
      
      // Firebase auth state listener for token management
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
  
      return () => unsubscribe(); // Clean up listener on unmount
    };
  
    fetchTransactions();
  }, []);
  
  // Filter transactions by search, month, and year
  useEffect(() => {
    setFilteredTransactions(
      transactions.filter((transaction) => {
        const matchesSearch = `${transaction.firstName} ${transaction.surname} ${transaction.email} ${transaction.telephone}`
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesMonth = month ? dayjs(transaction.dateOfEntry).format('MMMM') === month : true;
        const matchesYear = year ? dayjs(transaction.dateOfEntry).format('YYYY') === year : true;
        return matchesSearch && matchesMonth && matchesYear;
      })
    );
  }, [search, month, year, transactions]);

  if (loading) return <CircularProgress />;

  return (
    <div>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
        {/* Filters */}
        {/* <TextField
          label="Search by Name, Email, or Telephone"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        /> */}
        <FormControl style={{ minWidth: 120 }}>
          <InputLabel>Month</InputLabel>
          <Select value={month || ''} onChange={(e) => setMonth(e.target.value || undefined)}>
            <MenuItem value="">All</MenuItem>
            {months.map((m) => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl style={{ minWidth: 120 }}>
          <InputLabel>Year</InputLabel>
          <Select value={year || ''} onChange={(e) => setYear(e.target.value || undefined)}>
            <MenuItem value="">All</MenuItem>
            {years.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Export Button */}
        <Button variant="outlined" size="small" style={{ height: 40 }}>
          <CSVLink data={filteredTransactions} filename="transactions.csv" style={{ textDecoration: 'none', color: 'inherit' }}>
            Export to CSV
          </CSVLink>
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              {/* <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell> */}
              {/* <TableCell>Telephone</TableCell> */}
              <TableCell>Savings Deposits</TableCell>
              <TableCell>Withdrawals</TableCell>
              <TableCell> Total Savings</TableCell>
              <TableCell>Total Withdrawals</TableCell>
              <TableCell>Grand Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{dayjs(transaction.dateOfEntry).format('DD MMM YYYY')}</TableCell>
                {/* <TableCell>{transaction.firstName}</TableCell>
                <TableCell>{transaction.surname}</TableCell>
                <TableCell>{transaction.email}</TableCell>
                <TableCell>{transaction.telephone}</TableCell> */}
                <TableCell>{transaction.savingsDeposits}</TableCell>
                <TableCell>{transaction.withdrawals}</TableCell>
                <TableCell>{transaction.savingsBalance}</TableCell>
                <TableCell>{transaction.totalWithdrawals}</TableCell>
                <TableCell>{transaction.grandTotal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TransactionsTable;
