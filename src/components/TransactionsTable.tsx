import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { auth } from "@/app/api/config";

interface Record {
  date: string;
  savings?: number;
  contributions?: number;
  loans?: number;
  assetLoans?: number;
  cumulativeSavings: number;
  cumulativeContributions: number;
  cumulativeLoans: number;
  cumulativeAssetLoans: number;
  grandTotal: number;
  firstName: string;
  surname: string;
  email: string;
  img?: string;
  telephone1: string;
  residentialAddress: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
  bvn: string;
  assets?: number;
}

const TransactionsTable: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError("");
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User not authenticated. Please log in again.");
      }

      const token = await user.getIdToken();
      const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
      const response = await axios.get<{ stats: Record[] }>(
        `${serverURL}/member/savings/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const apiRecords = response.data.stats || [];
      let cumulativeSavings = 0;
      let cumulativeContributions = 0;
      let cumulativeLoans = 0;
      let cumulativeAssetLoans = 0;

      const enrichedRecords = apiRecords.map((record) => {
        const savings = record.savings || 0;
        const contributions = record.contributions || 0;
        const loans = record.loans || 0;
        const assetLoans = record.assetLoans || 0;
        const assets = record.assets || 0;

        cumulativeSavings += savings;
        cumulativeContributions += contributions;
        cumulativeLoans += loans;
        cumulativeAssetLoans += assetLoans;

        return {
          ...record,
          cumulativeSavings,
          cumulativeContributions,
          cumulativeLoans,
          cumulativeAssetLoans,
          grandTotal: record.grandTotal || 0,
          assets, // Ensure assets are displayed properly
          img: record.img || "", // Default image if none provided
        };
      });

      setRecords(enrichedRecords);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = records.filter((record) => {
    const matchesSearch = search
      ? Object.values(record).some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      : true;

    const matchesFilter = filter ? record.date.startsWith(filter) : true;

    return matchesSearch && matchesFilter;
  });

  const paginatedRecords = filteredRecords.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const uniqueMonths = Array.from(
    new Set(records.map((record) => record.date.slice(0, 7)))
  );

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
      {loading && <CircularProgress style={{ display: "block", margin: "auto" }} />}

      <FormControl variant="outlined" fullWidth style={{ marginBottom: 20 }}>
        <InputLabel>Filter by Month/Year</InputLabel>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          label="Filter by Month/Year"
        >
          {uniqueMonths.map((month) => (
            <MenuItem key={month} value={month}>
              {month}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Search by Value"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ margin: "20px 0" }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Surname</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>House Address</TableCell>
              <TableCell>Next of Kin Name</TableCell>
              <TableCell>Next of Kin Number</TableCell>
              <TableCell>Bvn</TableCell>
              <TableCell>Assets</TableCell>
              <TableCell>Contributions</TableCell>
              <TableCell>Loans</TableCell>
              <TableCell>Asset Loans</TableCell>
              <TableCell>Cumulative Savings</TableCell>
              <TableCell>Cumulative Contributions</TableCell>
              <TableCell>Cumulative Loans</TableCell>
              <TableCell>Cumulative Asset Loans</TableCell>
              <TableCell>Grand Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRecords.map((record, index) => (
              <TableRow key={index}>
                <TableCell>{record.date}</TableCell>
                <TableCell>
                  {record.img ? (
                    <Avatar src={record.img} alt="Member Profile" sx={{ width: 40, height: 40 }} />
                  ) : (
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "#9c27b0",
                        color: "#fff",
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>{record.surname}</TableCell>
                <TableCell>{record.firstName}</TableCell>
                <TableCell>{record.telephone1}</TableCell>
                <TableCell>{record.email}</TableCell>
                <TableCell>{record.residentialAddress}</TableCell>
                <TableCell>{record.nextOfKinName}</TableCell>
                <TableCell>{record.nextOfKinPhone}</TableCell>
                <TableCell>{record.bvn}</TableCell>
                <TableCell>{record.assets || 0}</TableCell>
                <TableCell>{record.contributions}</TableCell>
                <TableCell>{record.loans}</TableCell>
                <TableCell>{record.assetLoans}</TableCell>
                <TableCell>{record.cumulativeSavings}</TableCell>
                <TableCell>{record.cumulativeContributions}</TableCell>
                <TableCell>{record.cumulativeLoans}</TableCell>
                <TableCell>{record.cumulativeAssetLoans}</TableCell>
                <TableCell>{record.grandTotal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredRecords.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </>
  );
};

export default TransactionsTable;
