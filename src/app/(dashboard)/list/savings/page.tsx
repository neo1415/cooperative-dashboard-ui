// "use client"

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
// } from "@mui/material";
// import { auth } from "@/app/api/config";

// interface Record {
//   date: string;
//   savings: number;
//   contributions: number;
//   loans: number;
//   cumulativeSavings: number; // Calculated on the frontend
//   cumulativeContributions: number; // Calculated on the frontend
//   cumulativeLoans: number; // Calculated on the frontend
//   grandTotal: number; // Recalculated on the frontend
// }

// const TransactionsTable: React.FC = () => {
//   const [records, setRecords] = useState<Record[]>([]);
//   const [filter, setFilter] = useState("");
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   useEffect(() => {
//     const fetchRecords = async () => {
//       try {
//         setLoading(true);
//         const user = auth.currentUser;
//         if (!user) {
//           setError("User not authenticated");
//           return;
//         }

//         const token = await user.getIdToken();
//         const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
//         const response = await axios.get<{ stats: Record[] }>(
//           `${serverURL}/member/savings/stats`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         console.log("API Response:", response.data);

//         // Sort records by date
//         const sortedRecords = response.data.stats.sort(
//           (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
//         );

//         // Calculate cumulative totals and enforce consistent Grand Total calculation
//         let cumulativeSavings = 0;
//         let cumulativeContributions = 0;
//         let cumulativeLoans = 0;

//         const enrichedRecords = sortedRecords.map((record) => {
//           cumulativeSavings += record.savings || 0;
//           cumulativeContributions += record.contributions || 0;
//           cumulativeLoans += record.loans || 0;

//           // Recalculate Grand Total consistently
//           const grandTotal = cumulativeSavings - cumulativeLoans;

//           return {
//             ...record,
//             cumulativeSavings,
//             cumulativeContributions,
//             cumulativeLoans,
//             grandTotal,
//           };
//         });

//         setRecords(enrichedRecords);
//       } catch (err) {
//         console.error("Failed to fetch records:", err);
//         setError("Failed to fetch records");
//       } finally {
//         setLoading(false);
//       }
//     };

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

//       <FormControl variant="outlined" fullWidth>
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
//               <TableCell>Savings</TableCell>
//               <TableCell>Contributions</TableCell>
//               <TableCell>Loans</TableCell>
//               <TableCell>Cumulative Savings</TableCell>
//               <TableCell>Cumulative Contributions</TableCell>
//               <TableCell>Cumulative Loans</TableCell>
//               <TableCell>Grand Total</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {paginatedRecords.map((record) => (
//               <TableRow key={record.date}>
//                 <TableCell>{record.date}</TableCell>
//                 <TableCell>{record.savings}</TableCell>
//                 <TableCell>{record.contributions}</TableCell>
//                 <TableCell>{record.loans}</TableCell>
//                 <TableCell>{record.cumulativeSavings}</TableCell>
//                 <TableCell>{record.cumulativeContributions}</TableCell>
//                 <TableCell>{record.cumulativeLoans}</TableCell>
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
