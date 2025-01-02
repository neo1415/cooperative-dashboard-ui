"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "@/app/api/config";
import Image from "next/image";

const CreditScore = () => {
  const [creditScore, setCreditScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreditScore = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
          const response = await axios.get(`${serverURL}/member/credit-score`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setCreditScore(response.data.creditScore);
        } else {
          setError("User not authenticated");
        }
      } catch (error) {
        setError("Failed to fetch credit score");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreditScore();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Credit Score</h1>
        <Image src="/scoreIcon.png" alt="Credit Score Icon" width={44} height={44} />
      </div>

      <div className="text-center mt-6">
        <div className="text-6xl font-bold text-blue-500">{creditScore}</div>
        <p className="text-gray-500 mt-2">Your current credit score</p>
      </div>

      <div className="mt-8 text-sm text-gray-600 text-center">
        <p>Keep up the good work to maintain or improve your score!</p>
      </div>
    </div>
  );
};

export default CreditScore;
