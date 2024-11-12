import React from 'react';
import Announcements from '@/components/Announcements';
import AssetChart from '@/components/AssetChart';
import CountChart from '@/components/CountChart';
import EventCalender from '@/components/EventCalender';
import UserCard from '@/components/UserCards';

const AdminPage = () => {
  const totalSavingsCount = 120;  // Replace with real data
  const totalLoansApproved = 75;  // Replace with real data

  // Example values for each UserCard
  const userCardData = [
    { type: 'Loans', value: 50 },      // Replace with real values
    { type: 'Repayed', value: 30 },    // Replace with real values
    { type: 'Assets', value: 20 },     // Replace with real values
    { type: 'Purchased', value: 10 },  // Replace with real values
  ];

  return (
    <div className="p-4 flex flex-col gap-6 md:flex-row">
      {/* Left Column */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        {/* User Cards */}
        <div className="flex flex-wrap gap-4 justify-around sm:justify-between">
          {userCardData.map((card) => (
            <UserCard key={card.type} type={card.type} value={card.value} />
          ))}
        </div>
  
        {/* Middle Charts */}
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="w-full h-[300px] md:h-[350px] lg:w-1/3 lg:h-[450px]">
            {/* <CountChart totalSavingsCount={totalSavingsCount} totalLoansApproved={totalLoansApproved} /> */}
          </div>
          <div className="w-full h-[300px] md:h-[350px] lg:w-2/3 lg:h-[450px]">
            {/* <AssetChart totalSavingsCount={totalSavingsCount} totalLoansApproved={totalLoansApproved} /> */}
          </div>
        </div>
  
        {/* Bottom Chart */}
        <div className="w-full h-[350px] md:h-[400px] lg:h-[500px]">
          {/* <FinanceChart /> */}
        </div>
      </div>
  
      {/* Right Column */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <EventCalender />
        <Announcements />
      </div>
    </div>
  );
  
};

export default AdminPage;
