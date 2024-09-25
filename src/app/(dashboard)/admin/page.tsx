import CountChart from '@/components/CountChart'
import UserCard from '@/components/UserCards'
import React from 'react'

const AdminPage = () => {
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
      {/* LEFT */}
      <div className='w-full lg:w-2/3 flex flex-col gap-8'>
      {/* USERCARDS */}
      <div className='flex gap-4 justify-between flex-wrap'>
      <UserCard type='Loans'/>
      <UserCard type='Repayed'/>
      <UserCard type='Assets'/>
      <UserCard type='Purchased'/>
      </div>
      {/* MIDDLE CHARTS */}
      <div className='flex gap-4 flex-col lg:flex-row'>
    {/* COUNT CHART */}
    <div className='w-full lg:w-1/3 h-[450px]'>
    <CountChart />
    </div>
    {/* LOAN CHART */}
    <div className='w-full lg:w-2/3 h-[450px]'>
    
    </div>
      </div>
      {/* BOTTOM CHARTS */}
      <div className=''>

      </div>
      </div>
      {/* RIGHT */}
      <div className='w-full lg:w-1/3'></div>
    </div>
  )
}

export default AdminPage