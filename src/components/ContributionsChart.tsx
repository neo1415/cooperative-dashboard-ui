import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { Button, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Collapse, Grid } from '@mui/material';

interface ContributionsChartProps {
  data: { [key: string]: any };
  timeRange: string;
}

const ContributionsChart: React.FC<ContributionsChartProps> = ({ data, timeRange }) => {
  // Prepare the data for the bar chart
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key,
    Contributions: value.totalContributions || 0,
  }));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" className="mb-4">
          Contributions ({timeRange})
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="Contributions" fill="#6495ED" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ContributionsChart;
