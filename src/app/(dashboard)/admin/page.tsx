import React from 'react';
import Announcements from '@/components/Announcements';
import AssetChart from '@/components/AssetChart';
import CountChart from '@/components/CountChart';
import EventCalender from '@/components/EventCalender';
import UserCard from '@/components/UserCards';

const AdminPage = () => {
  const totalSavingsCount = 120;  // Replace with real data
  const totalLoansApproved = 75;  // Replace with real data

  return (
    <div className="p-4 flex flex-col gap-4 md:flex-row">
      {/* Left Column */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* User Cards */}
        <div className="flex gap-4 justify-between flex-wrap">
          {['Loans', 'Repayed', 'Assets', 'Purchased'].map((type) => (
            <UserCard key={type} type={type} />
          ))}
        </div>

        {/* Middle Charts */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/3 h-[450px]">
            {/* <CountChart totalSavingsCount={totalSavingsCount} totalLoansApproved={totalLoansApproved} /> */}
          </div>
          <div className="w-full lg:w-2/3 h-[450px]">
            {/* <AssetChart totalSavingsCount={totalSavingsCount} totalLoansApproved={totalLoansApproved} /> */}
          </div>
        </div>

        {/* Bottom Chart */}
        <div className="w-full h-[500px]">
          {/* <FinanceChart /> */}
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalender />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
