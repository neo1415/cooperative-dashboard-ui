import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { Button, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Collapse, Grid } from '@mui/material';

interface ProfitChartProps {
  data: { [key: string]: any };
  timeRange: string;
}

const ProfitChart: React.FC<ProfitChartProps> = ({ data, timeRange }) => {
  // Prepare data for the line chart
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key,
    Profit: value.profit || 0,
  }));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" className="mb-4">
          Profit Trends ({timeRange})
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
            <Legend />
            <Line type="monotone" dataKey="Profit" stroke="#32CD32" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProfitChart;
