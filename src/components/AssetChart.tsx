"use client"

import Image from 'next/image';
import React from 'react'
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Mon',
    Assets: 4000,
    Purchased: 2400,
  },
  {
    name: 'Tue',
    Assets: 3000,
    Purchased: 1398,
  },
  {
    name: 'Wed',
    Assets: 2000,
    Purchased: 9800,
  },
  {
    name: 'Thur',
    Assets: 2780,
    Purchased: 3908,
  },
  {
    name: 'Fri',
    Assets: 1890,
    Purchased: 4800,
  },
  {
    name: 'Sat',
    Assets: 2390,
    Purchased: 3800,
  },
  {
    name: 'Sun',
    Assets: 3490,
    Purchased: 4300,
  },
];

const AssetChart = () => {
  return (
    <div className='bg-white rounded-lg p-4 h-full'>
        <div className='flex justify-between items-center'>
            <h1 className='text-lg font-semibold'>Attendance</h1>
            <Image 
            src='/moreDark.png'
            alt='moredark-icon'
            width={20}
            height={20}
            />
        </div>
        <ResponsiveContainer width="100%" height="90%">
        <BarChart
          width={500}
          height={300}
          data={data}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#ddd' />
          <XAxis dataKey="name" axisLine={false} tick={{fill:'#d1d5db'}} tickLine={false} />
          <YAxis axisLine={false} tick={{fill:'#d1d5db'}} tickLine={false} />
          <Tooltip contentStyle={{borderRadius:'10px', borderColor:'lightgray'}} />
          <Legend align='left' verticalAlign='top' 
           wrapperStyle={{paddingTop:'20px', paddingBottom:'40px'}} />
          <Bar 
          dataKey="Assets" 
          fill="#FAE27C"
          legendType='circle'
          radius={[10,10,0,0]}
          />
          <Bar 
          dataKey="Purchased" 
          fill='#C3EBFA' 
          legendType='circle'
          radius={[10,10,0,0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AssetChart