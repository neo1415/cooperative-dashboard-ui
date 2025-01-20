"use client";

import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Collapse, Grid } from '@mui/material';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import axios from 'axios';
import { auth } from '@/app/api/config';
import { SelectChangeEvent } from '@mui/material';
import ContributionsChart from '@/components/ContributionsChart';
import LoanToContribution from '@/components/LoanToContribution';
import ProfitChart from '@/components/ProfitChart';

interface ReportEntry {
  type: string;
  id: string;
  amount?: number;
  interestProfit?: number;
  formProfit?: number;
  shareCapitalProfit?: number;
}

interface MonthlyData {
  totalSavings: number;
  totalContributions: number;
  totalLoansRequested: number;
  totalLoansApproved: number;
  totalLoanAmount: number;
  totalApprovedLoanAmount: number;
  totalAssetsRequested: number;
  totalAssetsApproved: number;
  totalAssetAmount: number;
  totalApprovedAssetAmount: number;
  profit: number;
  entries?: ReportEntry[];
}

interface YearlyData {
  [key: string]: MonthlyData;
}

interface GroupedData {
  monthlyData: { [key: string]: MonthlyData };
  yearlyData: YearlyData;
}

interface ReportData {
  totalMembers: number;
  totalAssetsCount: number;
  savings: {
    totalSavings: number;
    totalContributions: number;
    shareCapital: number;
  };
  loans: {
    totalRequested: number;
    approved: number;
    totalAmount: number;
    totalApprovedAmount: number;
  };
  assets: {
    totalRequested: number;
    approved: number;
    totalAmount: number;
    totalApprovedAmount: number;
  };
  debtors: {
    totalDebtors: number;
    totalDebtAmount: number;
  };
  totalProfit: number;
  groupedData: GroupedData;
}

const FinancialStats: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [allTime, setAllTime] = useState<boolean>(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          setError("User not authenticated");
          return;
        }

        const token = await user.getIdToken();
        const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
        const response = await axios.get(`${serverURL}/reports/savings-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const groupedData = response.data.groupedData;
        const shareCapitalAmount = response.data.savings.shareCapital || 0;

        const monthlyData: { [key: string]: MonthlyData } = {};
        Object.entries(groupedData).forEach(([category, data]) => {
          Object.entries(data).forEach(([month, values]) => {
            if (!monthlyData[month]) {
              monthlyData[month] = {
                totalSavings: 0,
                totalContributions: 0,
                totalLoansRequested: 0,
                totalLoansApproved: 0,
                totalLoanAmount: 0,
                totalApprovedLoanAmount: 0,
                totalAssetsRequested: 0,
                totalAssetsApproved: 0,
                totalAssetAmount: 0,
                totalApprovedAssetAmount: 0,
                profit: 0,
                entries: [],
              };
            }

            const current = monthlyData[month];

            current.totalSavings += values.totalSavings || 0;
            current.totalContributions += values.totalContributions || 0;
            current.totalLoansRequested += values.totalLoansRequested || 0;
            current.totalLoansApproved += values.totalLoansApproved || 0;
            current.totalLoanAmount += values.totalLoanAmount || 0;
            current.totalApprovedLoanAmount += values.totalApprovedLoanAmount || 0;
            current.totalAssetsRequested += values.totalAssetsRequested || 0;
            current.totalAssetsApproved += values.totalAssetsApproved || 0;
            current.totalAssetAmount += values.totalAssetAmount || 0;
            current.totalApprovedAssetAmount += values.totalApprovedAssetAmount || 0;

            const newEntries = (values.entries || []).filter(
              (entry) => !current.entries.some((e) => e.type === entry.type && e.id === entry.id)
            );

            current.entries = [...current.entries, ...newEntries];

            current.profit += newEntries.reduce((sum, entry) => {
              return sum + (entry.interestProfit || 0) + (entry.formProfit || 0) + (entry.shareCapitalProfit || 0);
            }, 0);

            if (category === "savings" && values.entries?.some((e) => e.type === "shareCapital")) {
              const shareCapitalEntry = values.entries.find((e) => e.type === "shareCapital");
              if (shareCapitalEntry) {
                current.entries.push({
                  type: "shareCapital",
                  id: `shareCapital-${month}`,
                  amount: shareCapitalEntry.amount,
                  shareCapitalProfit: shareCapitalEntry.amount,
                });
                current.profit += shareCapitalEntry.amount || 0;
              }
            }
          });
        });

        const sortedMonthlyData = Object.fromEntries(
          Object.entries(monthlyData).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
        );

        const yearlyData: YearlyData = {};
        Object.entries(sortedMonthlyData).forEach(([month, data]) => {
          const year = month.split("-")[0];
          if (!yearlyData[year]) {
            yearlyData[year] = {
              totalSavings: 0,
              totalContributions: 0,
              totalLoansRequested: 0,
              totalLoansApproved: 0,
              totalLoanAmount: 0,
              totalApprovedLoanAmount: 0,
              totalAssetsRequested: 0,
              totalAssetsApproved: 0,
              totalAssetAmount: 0,
              totalApprovedAssetAmount: 0,
              profit: 0,
              entries: [],
            };
          }

          const currentYear = yearlyData[year];
          currentYear.totalSavings += data.totalSavings;
          currentYear.totalContributions += data.totalContributions;
          currentYear.totalLoansRequested += data.totalLoansRequested;
          currentYear.totalLoansApproved += data.totalLoansApproved;
          currentYear.totalLoanAmount += data.totalLoanAmount;
          currentYear.totalApprovedLoanAmount += data.totalApprovedLoanAmount;
          currentYear.totalAssetsRequested += data.totalAssetsRequested;
          currentYear.totalAssetsApproved += data.totalAssetsApproved;
          currentYear.totalAssetAmount += data.totalAssetAmount;
          currentYear.totalApprovedAssetAmount += data.totalApprovedAssetAmount;

          currentYear.profit += data.entries.reduce((sum, entry) => {
            return sum + (entry.interestProfit || 0) + (entry.formProfit || 0) + (entry.shareCapitalProfit || 0);
          }, 0);

          currentYear.entries = [...currentYear.entries, ...data.entries];
        });

        Object.keys(yearlyData).forEach((year) => {
          const shareCapitalInYear = Object.entries(monthlyData)
            .filter(([month]) => month.startsWith(year))
            .some(([, monthData]) => monthData.entries?.some((e) => e.type === "shareCapital"));

          if (!shareCapitalInYear) {
            yearlyData[year].entries = yearlyData[year].entries.filter((e) => e.type !== "shareCapital");
          }
        });

        const sortedYearlyData = Object.fromEntries(
          Object.entries(yearlyData).sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
        );

        const latestMonth = Object.keys(sortedMonthlyData)[0];
        const latestYear = Object.keys(sortedYearlyData).pop();

        setReportData({ ...response.data, groupedData: { monthlyData: sortedMonthlyData, yearlyData: sortedYearlyData } });
        setSelectedMonth(latestMonth);
        setSelectedYear(latestYear);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const handleDownloadCSV = () => {
    if (!reportData) return;
    const rows = Object.entries(reportData.groupedData?.monthlyData || {}).map(([key, value]) => {
      return `${key},₦${value.totalSavings || 0},₦${value.totalContributions || 0},₦${value.totalLoanAmount || 0},₦${value.profit || 0}`;
    });
    const csvContent = [
      "Month,Total Savings,Total Contributions,Total Loan Amount,Profit",
      ...rows,
    ].join("\n");
    saveAs(new Blob([csvContent], { type: "text/csv;charset=utf-8;" }), "financial_report.csv");
  };

  const handleDownloadPDF = () => {
    if (!reportData) return;
    const doc = new jsPDF();
    doc.text("Financial Report", 20, 10);
    Object.entries(reportData.groupedData?.monthlyData || {}).forEach(([key, value], index) => {
      doc.text(
        `${key}: Savings: ₦${value.totalSavings || 0}, Contributions: ₦${value.totalContributions || 0}, Loan Amount: ₦${value.totalLoanAmount || 0}, Profit: ₦${value.profit || 0}`,
        10,
        20 + index * 10
      );
    });
    doc.save("financial_report.pdf");
  };

  const handleMonthChange = (event: SelectChangeEvent<string>) => {
    setSelectedMonth(event.target.value);
    setAllTime(false);
  };

  const handleYearChange = (event: SelectChangeEvent<string>) => {
    setSelectedYear(event.target.value);
    setAllTime(false);
  };

  const handleAllTime = () => {
    setAllTime(true);
    setSelectedMonth(null);
    setSelectedYear(null);
  };

  const toggleRow = (row: string) => {
    setExpandedRow(expandedRow === row ? null : row);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  const { monthlyData = {}, yearlyData = {} } = reportData?.groupedData || {};

  const filteredMonthlyData = allTime ? monthlyData : selectedMonth ? { [selectedMonth]: monthlyData[selectedMonth] } : monthlyData;
  const filteredYearlyData = allTime ? yearlyData : selectedYear ? { [selectedYear]: yearlyData[selectedYear] } : yearlyData;

  return (
    <div className="container mx-auto py-4">
      <Typography variant="h4" className="mb-4 text-center">
        Financial Statistics & Reports
      </Typography>

      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Members</Typography>
              <Typography variant="h4">{reportData?.totalMembers || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Assets Count</Typography>
              <Typography variant="h4">{reportData?.totalAssetsCount || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Contributions</Typography>
              <Typography variant="h4">₦{allTime ? reportData?.savings.totalContributions : selectedYear ? filteredYearlyData[selectedYear]?.totalContributions : selectedMonth ? filteredMonthlyData[selectedMonth]?.totalContributions : 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Profit</Typography>
              <Typography variant="h4">₦{allTime ? reportData?.totalProfit : selectedYear ? filteredYearlyData[selectedYear]?.profit : selectedMonth ? filteredMonthlyData[selectedMonth]?.profit : 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {reportData && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Select value={selectedMonth || ""} onChange={handleMonthChange} displayEmpty>
                <MenuItem value="">All Months</MenuItem>
                {Object.keys(monthlyData).map((month) => (
                  <MenuItem key={month} value={month}>{month}</MenuItem>
                ))}
              </Select>
              <Select value={selectedYear || ""} onChange={handleYearChange} displayEmpty>
                <MenuItem value="">All Years</MenuItem>
                {Object.keys(yearlyData).map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
              <Button variant="outlined" onClick={handleAllTime}>All Time</Button>
            </div>
            <div className="flex gap-4">
              <Button variant="contained" color="primary" onClick={handleDownloadCSV}>Download CSV</Button>
              <Button variant="contained" color="secondary" onClick={handleDownloadPDF}>Download PDF</Button>
            </div>
          </div>

          <Grid container spacing={3} className="mb-6">
            <Grid item xs={12} md={6}>
              <ContributionsChart data={filteredMonthlyData} timeRange={allTime ? "allTime" : selectedYear ? "yearly" : "monthly"} />
            </Grid>
            <Grid item xs={12} md={6}>
              <LoanToContribution data={filteredMonthlyData} timeRange={allTime ? "allTime" : selectedYear ? "yearly" : "monthly"} />
            </Grid>
            <Grid item xs={12}>
              <ProfitChart data={filteredMonthlyData} timeRange={allTime ? "allTime" : selectedYear ? "yearly" : "monthly"} />
            </Grid>
          </Grid>

          <Typography variant="h5" className="mt-6 mb-2">Monthly Data</Typography>
          {Object.entries(filteredMonthlyData).length > 0 ? (
            <Grid container spacing={3} justifyContent="center" alignItems="center">
              {Object.entries(filteredMonthlyData).map(([month, data]) => (
                <Grid item xs={12} sm={6} md={4} key={month}>
                  <Card className="mb-4">
                    <CardContent>
                      <Typography variant="h6" align="center">{month}</Typography>
                      <Button onClick={() => toggleRow(month)}>{expandedRow === month ? "Collapse" : "Expand"}</Button>
                      <Collapse in={expandedRow === month}>
                        <TableContainer component={Paper} className="mt-4">
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Interest Profit</TableCell>
                                <TableCell>Form Profit</TableCell>
                                <TableCell>Share Capital Profit</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {data.entries?.map((entry, index) => (
                                <TableRow key={index}>
                                  <TableCell>{entry.type}</TableCell>
                                  <TableCell>₦{entry.amount ?? "0"}</TableCell>
                                  <TableCell>₦{entry.interestProfit ?? "0"}</TableCell>
                                  <TableCell>₦{entry.formProfit ?? "0"}</TableCell>
                                  <TableCell>₦{entry.shareCapitalProfit ?? "0"}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Collapse>
                      <Typography>Total Savings: ₦{data.totalSavings || 0}</Typography>
                      <Typography>Total Contributions: ₦{data.totalContributions || 0}</Typography>
                      <Typography>Total Loans Requested: {data.totalLoansRequested || 0}</Typography>
                      <Typography>Total Loans Approved: {data.totalLoansApproved || 0}</Typography>
                      <Typography>Total Loan Amount: ₦{data.totalLoanAmount || 0}</Typography>
                      <Typography>Total Approved Loan Amount: ₦{data.totalApprovedLoanAmount || 0}</Typography>
                      <Typography>Total Assets Requested: {data.totalAssetsRequested || 0}</Typography>
                      <Typography>Total Assets Approved: {data.totalAssetsApproved || 0}</Typography>
                      <Typography>Total Asset Amount: ₦{data.totalAssetAmount || 0}</Typography>
                      <Typography>Total Approved Asset Amount: ₦{data.totalApprovedAssetAmount || 0}</Typography>
                      <Typography>Total Profit: ₦{data.profit || 0}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No Monthly Data Available</Typography>
          )}

          <Typography variant="h5" className="mt-6 mb-2">Yearly Data</Typography>
          {Object.entries(filteredYearlyData).length > 0 ? (
            <Grid container spacing={3} justifyContent="center" alignItems="center">
              {Object.entries(filteredYearlyData).map(([year, data]) => (
                <Grid item xs={12} sm={6} md={4} key={year}>
                  <Card className="mb-4">
                    <CardContent>
                      <Typography variant="h6" align="center">{year}</Typography>
                      <Button onClick={() => toggleRow(year)}>{expandedRow === year ? "Collapse" : "Expand"}</Button>
                      <Collapse in={expandedRow === year}>
                        <TableContainer component={Paper} className="mt-4">
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Interest Profit</TableCell>
                                <TableCell>Form Profit</TableCell>
                                <TableCell>Share Capital Profit</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {data.entries?.map((entry, index) => (
                                <TableRow key={index}>
                                  <TableCell>{entry.type}</TableCell>
                                  <TableCell>₦{entry.amount ?? "0"}</TableCell>
                                  <TableCell>₦{entry.interestProfit ?? "0"}</TableCell>
                                  <TableCell>₦{entry.formProfit ?? "0"}</TableCell>
                                  <TableCell>₦{entry.shareCapitalProfit ?? "0"}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Collapse>
                      <Typography>Total Savings: ₦{data.totalSavings || 0}</Typography>
                      <Typography>Total Contributions: ₦{data.totalContributions || 0}</Typography>
                      <Typography>Total Loans Requested: {data.totalLoansRequested || 0}</Typography>
                      <Typography>Total Loans Approved: {data.totalLoansApproved || 0}</Typography>
                      <Typography>Total Loan Amount: ₦{data.totalLoanAmount || 0}</Typography>
                      <Typography>Total Approved Loan Amount: ₦{data.totalApprovedLoanAmount || 0}</Typography>
                      <Typography>Total Assets Requested: {data.totalAssetsRequested || 0}</Typography>
                      <Typography>Total Assets Approved: {data.totalAssetsApproved || 0}</Typography>
                      <Typography>Total Asset Amount: ₦{data.totalAssetAmount || 0}</Typography>
                      <Typography>Total Approved Asset Amount: ₦{data.totalApprovedAssetAmount || 0}</Typography>
                      <Typography>Total Profit: ₦{data.profit || 0}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No Yearly Data Available</Typography>          )}
        </div>
      )}
    </div>
  );
};

export default FinancialStats;

