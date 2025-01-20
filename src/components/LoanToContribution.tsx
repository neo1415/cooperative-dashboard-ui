import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Button, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Collapse, Grid } from '@mui/material';

interface LoanToContributionProps {
  data: { [key: string]: any };
  timeRange: string;
}

const COLORS = ['#FFD700', '#6495ED']; // Light Gold for Loans, Light Blue for Contributions

const LoanToContribution: React.FC<LoanToContributionProps> = ({ data, timeRange }) => {
  // Aggregate loans and contributions for the pie chart
  const totalContributions = Object.values(data).reduce((sum, item: any) => sum + (item.totalContributions || 0), 0);
  const totalLoans = Object.values(data).reduce(
    (sum, item: any) => sum + (item.totalApprovedLoanAmount || 0) + (item.totalApprovedAssetAmount || 0),
    0
  );

  const chartData = [
    { name: 'Contributions', value: totalContributions },
    { name: 'Loans', value: totalLoans },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" className="mb-4">
          Contributions vs Loans ({timeRange})
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LoanToContribution;
