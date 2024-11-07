import React from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';

const CountChart = ({ totalSavingsCount, totalLoansApproved }) => {
  const data = [
    { name: 'Savings', count: totalSavingsCount, fill: '#8884d8' },
    { name: 'Loans Approved', count: totalLoansApproved, fill: '#82ca9d' },
  ];

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <h1 className="text-lg font-semibold">Savings & Loans</h1>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" data={data}>
          <RadialBar dataKey="count" cornerRadius={5} />
          <Legend />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CountChart;
