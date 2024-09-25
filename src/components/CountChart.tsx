"use client"
import Image from 'next/image';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Total',
    count: 106,
    fill: 'white',
  },
  {
    name: 'Loaners',
    count: 53,
    fill: '#FAE27C',
  },
  {
    name: 'debtors',
    count: 53,
    fill: '#C3EBFA',
  },
 
];


const CountChart = () => {
  return (
    <div className='bg-white rounded-xl h-full w-full p-4'>
        {/* TITLE */}
        <div className='flex justify-between items-center' >
            <h1 className='text-lg font-semibold'>Loans</h1>
            <Image 
            src='/moreDark.png' 
            alt='students-image' 
            width={20} 
            height={20} />
        </div>
        {/* CHART */}
        <div className='w-full h-[75%] relative'>
        <ResponsiveContainer >
        <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={32} data={data}>
          <RadialBar
            background
            dataKey="count"
          />
          {/* <Legend iconSize={10} layout="vertical" verticalAlign="middle" /> */}
        </RadialBarChart>
      </ResponsiveContainer>
      <Image src='/maleFemale.png' 
      alt='malefemale-icon' 
      width={50} 
      height={50}
      className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
      />
        </div>
        {/* BOTTOM */}
        <div className='flex justify-center gap-16 w-full'>
        <div className='flex justify-center items-center gap-16'>
          <div className='w-5 h-5 bg-neoYellow rounded-full'>
            <h1 className='font-bold'>1,234</h1>
            <h2 className='text-xs text-gray-300'>Loans(55%)</h2>
          </div>
          <div className='flex justify-center  gap-16'>
          <div className='w-5 h-5 bg-neoPurple rounded-full'>
            <h1 className='font-bold'>1,234</h1>
            <h2 className='text-xs text-gray-300'>Repayed(45%)</h2>
          </div>
        </div>

      </div>
   
      {/* RIGHT */}
      <div className='w-full lg:w-1/3'></div>
    </div>
    </div>
  )
}

export default CountChart