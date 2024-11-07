import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AssetChart = ({ totalSavingsCount, totalLoansApproved }) => {
  const data = [
    { name: 'Savings vs Loans', savings: totalSavingsCount, loansApproved: totalLoansApproved },
  ];

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <h1 className="text-lg font-semibold">Savings & Loans Comparison</h1>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} barSize={40}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="savings" fill="#8884d8" name="Savings" />
          <Bar dataKey="loansApproved" fill="#82ca9d" name="Loans Approved" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetChart;
