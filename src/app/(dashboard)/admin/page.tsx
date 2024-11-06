// src/app/(dashboard)/admin/page.tsx

import React from 'react';
import Announcements from '@/components/Announcements';
import AssetChart from '@/components/AssetChart';
import CountChart from '@/components/CountChart';
import EventCalender from '@/components/EventCalender';
import FinanceChart from '@/components/FinanceChart';
import UserCard from '@/components/UserCards';

const AdminPage = () => {
  // Mock data for total savings and approved loans
  const totalSavingsCount = 120;  // Replace with real data as needed
  const totalLoansApproved = 75;  // Replace with real data as needed

  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
      {/* LEFT */}
      <div className='w-full lg:w-2/3 flex flex-col gap-8'>
        {/* USERCARDS */}
        <div className='flex gap-4 justify-between flex-wrap'>
          <UserCard type='Loans' />
          <UserCard type='Repayed' />
          <UserCard type='Assets' />
          <UserCard type='Purchased' />
        </div>

        {/* MIDDLE CHARTS */}
        <div className='flex gap-4 flex-col lg:flex-row'>
          {/* LOAN CHART */}
          <div className='w-full lg:w-1/3 h-[450px]'>
            <CountChart totalSavingsCount={totalSavingsCount} totalLoansApproved={totalLoansApproved} />
          </div>
          {/* ASSET CHART */}
          <div className='w-full lg:w-2/3 h-[450px]'>
            <AssetChart totalSavingsCount={totalSavingsCount} totalLoansApproved={totalLoansApproved} />
          </div>
        </div>

        {/* BOTTOM CHARTS */}
        <div className='w-full h-[500px]'>
          <FinanceChart />
        </div>
      </div>

      {/* RIGHT */}
      <div className='w-full lg:w-1/3 flex flex-col gap-8'>
        <EventCalender />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
