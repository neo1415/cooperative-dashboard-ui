"use client";
import Image from "next/image";
import { PieChart, Pie, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "@/app/api/config";

const Performance = () => {
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
          const response = await axios.get(`${serverURL}/single-transaction`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Extract the needed values from response
          setSavingsBalance(response.data.savingsBalance);
          setTotalWithdrawals(response.data.totalWithdrawals);
        } else {
          setError('User not authenticated');
        }
      } catch (error) {
        setError('Failed to fetch transaction data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const total = savingsBalance + totalWithdrawals;
  const data = [
    { name: "Savings Balance", value: (savingsBalance / total) * 100, fill: "#C3EBFA" },
    { name: "Total Loans", value: (totalWithdrawals / total) * 100, fill: "#FAE27C" },
  ];

  return (
    <div className="bg-white p-4 rounded-md h-80 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Performance</h1>
        <Image src="/moreDark.png" alt="More Options" width={16} height={16} />
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            fill="#8884d8"
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-3xl font-bold" >{(savingsBalance / total * 10).toFixed(1)}</h1>
        <p className="text-xs text-gray-300">of 10 max LTS</p>
      </div>
      <h2 className="font-medium absolute bottom-16 left-0 right-0 m-auto text-center"><span
      style={{color: "#C3EBFA"}}
      >Savings </span >vs <span
      style={{ color: "#FAE27C" }}
      ></span>Loans</h2>
    </div>
  );
};

export default Performance;